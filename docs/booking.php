<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/yonetim/bootstrap.php';

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Yalnızca POST isteği kabul edilir.']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if (!in_array($originHost, ['coltur.com.tr', 'www.coltur.com.tr'], true)) {
        respond(403, ['ok' => false, 'message' => 'Geçersiz istek kaynağı.']);
    }
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'message' => 'Geçersiz form verisi.']);
}

$clean = static function (mixed $value, int $maxLength = 300): string {
    $text = trim((string) $value);
    $text = str_replace(["\r", "\n", "\0"], ' ', $text);
    return mb_substr($text, 0, $maxLength, 'UTF-8');
};

// Görünmeyen alan botlar tarafından doldurulursa sessizce başarılı dön.
if ($clean($data['website'] ?? '', 120) !== '') {
    respond(200, ['ok' => true]);
}

$name = $clean($data['name'] ?? '', 120);
$email = $clean($data['email'] ?? '', 180);
$phone = $clean($data['phone'] ?? '', 40);
$tour = $clean($data['tour'] ?? '', 180);
$date = $clean($data['date'] ?? '', 20);
$note = $clean($data['note'] ?? '', 1000);
$travellers = filter_var($data['travellers'] ?? null, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 20],
]);

if (mb_strlen($name, 'UTF-8') < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '' || $tour === '' || !$travellers) {
    respond(422, ['ok' => false, 'message' => 'Lütfen zorunlu alanları kontrol edin.']);
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    respond(422, ['ok' => false, 'message' => 'Lütfen geçerli bir tur tarihi seçin.']);
}

$tourDate = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone('Europe/Istanbul'));
$today = new DateTimeImmutable('today', new DateTimeZone('Europe/Istanbul'));
if (!$tourDate || $tourDate < $today) {
    respond(422, ['ok' => false, 'message' => 'Tur tarihi bugün veya daha ileri bir tarih olmalıdır.']);
}

$subject = 'Col Tur rezervasyon talebi: ' . $tour;
$message = implode("\n", [
    'Yeni rezervasyon talebi',
    '------------------------',
    'Tur: ' . $tour,
    'Tarih: ' . $date,
    'Kişi sayısı: ' . $travellers,
    'Ad soyad: ' . $name,
    'E-posta: ' . $email,
    'Telefon: ' . $phone,
    'Not: ' . ($note !== '' ? $note : '-'),
]);

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = [
    'From: Col Tur Web <web@coltur.com.tr>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$reservationId = 0;
try {
    $reservationId = coltur_store_reservation([
        'tour' => $tour,
        'date' => $date,
        'travellers' => $travellers,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'note' => $note,
    ]);
} catch (Throwable $error) {
    error_log('Col Tur rezervasyon kaydı oluşturulamadı: ' . $error->getMessage());
}

$sent = mail('rezervasyon@coltur.com.tr', $encodedSubject, $message, implode("\r\n", $headers));
if ($sent && $reservationId > 0) {
    try {
        coltur_mark_reservation_mailed($reservationId);
    } catch (Throwable $error) {
        error_log('Col Tur e-posta durumu güncellenemedi: ' . $error->getMessage());
    }
}

if (!$sent && $reservationId < 1) {
    respond(503, ['ok' => false, 'message' => 'Talep şu anda gönderilemedi.']);
}

respond(200, ['ok' => true, 'reference' => $reservationId > 0 ? $reservationId : null]);
