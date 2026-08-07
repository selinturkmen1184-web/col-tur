<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
header("Content-Security-Policy: default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'self'");
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

require_once __DIR__ . '/bootstrap.php';

$secureCookie = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_name('coltur_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/yonetim/',
    'secure' => $secureCookie,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

function h($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function clean_text($value, int $max = 500): string
{
    $text = trim((string) $value);
    $text = str_replace(["\0", "\r"], '', $text);
    return mb_substr($text, 0, $max, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $bytes = false;

        if (function_exists('random_bytes')) {
            try {
                $bytes = random_bytes(32);
            } catch (Throwable $error) {
                $bytes = false;
            }
        }

        if (!is_string($bytes) && function_exists('openssl_random_pseudo_bytes')) {
            try {
                $bytes = openssl_random_pseudo_bytes(32);
            } catch (Throwable $error) {
                $bytes = false;
            }
        }

        if (!is_string($bytes)) {
            $bytes = hash('sha256', session_id() . microtime(true) . uniqid('', true), true);
        }

        $_SESSION['csrf'] = bin2hex($bytes);
    }
    return (string) $_SESSION['csrf'];
}

function verify_csrf(): void
{
    $provided = (string) ($_POST['csrf'] ?? '');
    if ($provided === '' || !hash_equals(csrf_token(), $provided)) {
        http_response_code(419);
        exit('Oturum doğrulaması başarısız. Lütfen sayfayı yenileyin.');
    }
}

function redirect_panel(string $section = 'rezervasyonlar')
{
    header('Location: ./?section=' . rawurlencode($section));
    exit;
}

function flash(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

try {
    $config = coltur_admin_config();
} catch (Throwable $error) {
    http_response_code(503);
    ?><!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Çöl Tur Yönetim</title><link rel="stylesheet" href="./admin.css"></head><body class="login-page"><main class="login-card"><div class="brand-mark">ÇT</div><h1>Panel hazırlanıyor</h1><p>Güvenli giriş ayarları henüz tamamlanmadı.</p></main></body></html><?php
    exit;
}

$action = (string) ($_POST['action'] ?? '');

if ($action === 'login') {
    verify_csrf();
    $attempts = array_values(array_filter(
        is_array($_SESSION['login_attempts'] ?? null) ? $_SESSION['login_attempts'] : [],
        static fn ($time): bool => is_int($time) && $time > time() - 900
    ));

    if (count($attempts) >= 5) {
        $loginError = 'Çok fazla giriş denemesi yapıldı. 15 dakika sonra tekrar deneyin.';
    } else {
        $username = clean_text($_POST['username'] ?? '', 100);
        $password = (string) ($_POST['password'] ?? '');
        $validUser = hash_equals((string) $config['username'], $username);
        $validPassword = password_verify($password, (string) $config['password_hash']);

        if ($validUser && $validPassword) {
            session_regenerate_id(true);
            $_SESSION['authenticated'] = true;
            $_SESSION['login_attempts'] = [];
            $_SESSION['last_activity'] = time();
            redirect_panel();
        }

        $attempts[] = time();
        $_SESSION['login_attempts'] = $attempts;
        usleep(350000);
        $loginError = 'Kullanıcı adı veya şifre hatalı.';
    }
}

if ($action === 'logout') {
    verify_csrf();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'], $params['httponly']);
    }
    session_destroy();
    header('Location: ./');
    exit;
}

$authenticated = !empty($_SESSION['authenticated']);
if ($authenticated) {
    $lastActivity = (int) ($_SESSION['last_activity'] ?? 0);
    if ($lastActivity > 0 && $lastActivity < time() - 7200) {
        $_SESSION = [];
        session_destroy();
        header('Location: ./');
        exit;
    }
    $_SESSION['last_activity'] = time();
}

if (!$authenticated) {
    ?><!doctype html>
    <html lang="tr">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Çöl Tur Yönetim Girişi</title><link rel="stylesheet" href="./admin.css"></head>
    <body class="login-page">
      <main class="login-card">
        <div class="brand-mark">ÇT</div>
        <span class="eyebrow">ÇÖL TUR</span>
        <h1>Yönetim paneli</h1>
        <p>Rezervasyonları ve tur bilgilerini yönetmek için giriş yapın.</p>
        <?php if (!empty($loginError)): ?><div class="alert error"><?= h($loginError) ?></div><?php endif; ?>
        <form method="post" autocomplete="on">
          <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
          <input type="hidden" name="action" value="login">
          <label>Kullanıcı adı<input name="username" autocomplete="username" required autofocus></label>
          <label>Şifre<input type="password" name="password" autocomplete="current-password" required></label>
          <button type="submit">Giriş yap</button>
        </form>
        <a class="back-link" href="/">← Siteye dön</a>
      </main>
    </body>
    </html><?php
    exit;
}

$pdo = coltur_database();
$allowedStatuses = [
    'new' => 'Yeni',
    'contacted' => 'İletişime geçildi',
    'confirmed' => 'Onaylandı',
    'cancelled' => 'İptal',
    'archived' => 'Arşiv',
];

if (($_GET['export'] ?? '') === 'csv') {
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="coltur-rezervasyonlar-' . date('Y-m-d') . '.csv"');
    echo "\xEF\xBB\xBF";
    $output = fopen('php://output', 'wb');
    fputcsv($output, ['No', 'Tarih', 'Tur', 'Tur tarihi', 'Kişi', 'Ad soyad', 'E-posta', 'Telefon', 'Not', 'Durum']);
    $rows = $pdo->query('SELECT * FROM reservations ORDER BY id DESC')->fetchAll();
    foreach ($rows as $row) {
        fputcsv($output, [$row['id'], $row['created_at'], $row['tour'], $row['tour_date'], $row['travellers'], $row['name'], $row['email'], $row['phone'], $row['note'], $allowedStatuses[$row['status']] ?? $row['status']]);
    }
    fclose($output);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !in_array($action, ['login', 'logout'], true)) {
    verify_csrf();

    try {
        if ($action === 'reservation_status') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            $status = (string) ($_POST['status'] ?? '');
            if (!$id || !isset($allowedStatuses[$status])) {
                throw new RuntimeException('Geçersiz rezervasyon güncellemesi.');
            }
            $statement = $pdo->prepare('UPDATE reservations SET status = :status WHERE id = :id');
            $statement->execute([':status' => $status, ':id' => $id]);
            flash('success', 'Rezervasyon durumu güncellendi.');
            redirect_panel('rezervasyonlar');
        }

        if ($action === 'tour_update') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            $tours = coltur_read_tours();
            $found = false;
            foreach ($tours as &$tour) {
                if ((int) ($tour['id'] ?? 0) !== $id) {
                    continue;
                }
                $found = true;
                $price = filter_var($_POST['price'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 1000000]]);
                if ($price === false) {
                    throw new RuntimeException('Tur fiyatı geçersiz.');
                }
                $tour['title'] = clean_text($_POST['title'] ?? '', 180);
                $tour['location'] = clean_text($_POST['location'] ?? '', 120);
                $tour['category'] = clean_text($_POST['category'] ?? '', 80);
                $tour['duration'] = clean_text($_POST['duration'] ?? '', 80);
                $tour['price'] = (int) $price;
                $tour['badge'] = clean_text($_POST['badge'] ?? '', 80);
                $tour['overview'] = clean_text($_POST['overview'] ?? '', 1000);
                $tour['highlights'] = array_values(array_filter(array_map(static fn ($line) => clean_text($line, 120), preg_split('/\R/u', (string) ($_POST['highlights'] ?? '')) ?: [])));
                $tour['itinerary'] = array_values(array_filter(array_map(static fn ($line) => clean_text($line, 180), preg_split('/\R/u', (string) ($_POST['itinerary'] ?? '')) ?: [])));
                if ($tour['title'] === '' || $tour['location'] === '' || $tour['category'] === '' || $tour['duration'] === '' || $tour['overview'] === '') {
                    throw new RuntimeException('Zorunlu tur alanlarını doldurun.');
                }
                break;
            }
            unset($tour);
            if (!$found) {
                throw new RuntimeException('Tur bulunamadı.');
            }
            coltur_write_tours($tours);
            flash('success', 'Tur bilgileri gerçek sitede güncellendi.');
            redirect_panel('turlar');
        }

        if ($action === 'password_change') {
            $current = (string) ($_POST['current_password'] ?? '');
            $newPassword = (string) ($_POST['new_password'] ?? '');
            $confirmation = (string) ($_POST['new_password_confirmation'] ?? '');
            if (!password_verify($current, (string) $config['password_hash'])) {
                throw new RuntimeException('Mevcut şifre doğru değil.');
            }
            if (strlen($newPassword) < 12 || $newPassword !== $confirmation) {
                throw new RuntimeException('Yeni şifre en az 12 karakter olmalı ve iki alan eşleşmelidir.');
            }
            coltur_write_admin_config((string) $config['username'], password_hash($newPassword, PASSWORD_DEFAULT), (string) $config['data_dir']);
            flash('success', 'Yönetim paneli şifresi değiştirildi.');
            redirect_panel('ayarlar');
        }
    } catch (Throwable $error) {
        flash('error', $error->getMessage());
        redirect_panel((string) ($_POST['section'] ?? 'rezervasyonlar'));
    }
}

$section = (string) ($_GET['section'] ?? 'rezervasyonlar');
if (!in_array($section, ['rezervasyonlar', 'turlar', 'ayarlar'], true)) {
    $section = 'rezervasyonlar';
}

$flash = is_array($_SESSION['flash'] ?? null) ? $_SESSION['flash'] : null;
unset($_SESSION['flash']);

$statusFilter = (string) ($_GET['status'] ?? '');
$search = clean_text($_GET['q'] ?? '', 120);
$conditions = [];
$parameters = [];
if ($statusFilter !== '' && isset($allowedStatuses[$statusFilter])) {
    $conditions[] = 'status = :status';
    $parameters[':status'] = $statusFilter;
}
if ($search !== '') {
    $conditions[] = '(name LIKE :search OR phone LIKE :search OR email LIKE :search OR tour LIKE :search)';
    $parameters[':search'] = '%' . $search . '%';
}
$sql = 'SELECT * FROM reservations' . ($conditions ? ' WHERE ' . implode(' AND ', $conditions) : '') . ' ORDER BY id DESC LIMIT 200';
$statement = $pdo->prepare($sql);
$statement->execute($parameters);
$reservations = $statement->fetchAll();

$stats = [
    'total' => (int) $pdo->query('SELECT COUNT(*) FROM reservations')->fetchColumn(),
    'new' => (int) $pdo->query("SELECT COUNT(*) FROM reservations WHERE status = 'new'")->fetchColumn(),
    'confirmed' => (int) $pdo->query("SELECT COUNT(*) FROM reservations WHERE status = 'confirmed'")->fetchColumn(),
    'upcoming' => (int) $pdo->query("SELECT COUNT(*) FROM reservations WHERE tour_date >= date('now') AND status NOT IN ('cancelled', 'archived')")->fetchColumn(),
];
$tours = coltur_read_tours();
?>
<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Çöl Tur Yönetim Paneli</title>
  <link rel="stylesheet" href="./admin.css">
  <script src="./admin.js" defer></script>
</head>
<body class="admin-page">
  <aside class="sidebar">
    <a class="admin-brand" href="./"><span>ÇT</span><div><strong>Çöl Tur</strong><small>Yönetim Paneli</small></div></a>
    <nav aria-label="Yönetim menüsü">
      <a class="<?= $section === 'rezervasyonlar' ? 'active' : '' ?>" href="./?section=rezervasyonlar"><span>01</span>Rezervasyonlar<?php if ($stats['new'] > 0): ?><b><?= $stats['new'] ?></b><?php endif; ?></a>
      <a class="<?= $section === 'turlar' ? 'active' : '' ?>" href="./?section=turlar"><span>02</span>Turlar ve fiyatlar</a>
      <a class="<?= $section === 'ayarlar' ? 'active' : '' ?>" href="./?section=ayarlar"><span>03</span>Güvenlik</a>
    </nav>
    <div class="sidebar-bottom">
      <a href="/" target="_blank" rel="noopener">Siteyi görüntüle ↗</a>
      <form method="post"><input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>"><input type="hidden" name="action" value="logout"><button type="submit">Çıkış yap</button></form>
    </div>
  </aside>

  <main class="admin-main">
    <header class="topbar"><button class="menu-toggle" type="button" aria-label="Menüyü aç" aria-expanded="false">☰</button><div><span class="eyebrow">ÇÖL TUR · 1995’TEN BERİ</span><h1><?= $section === 'rezervasyonlar' ? 'Rezervasyonlar' : ($section === 'turlar' ? 'Turlar ve fiyatlar' : 'Güvenlik ayarları') ?></h1></div><div class="topbar-user"><span>Yönetici</span><strong><?= h($config['username']) ?></strong></div></header>

    <?php if ($flash): ?><div class="alert <?= h($flash['type']) ?>"><?= h($flash['message']) ?></div><?php endif; ?>

    <?php if ($section === 'rezervasyonlar'): ?>
      <section class="stats-grid" aria-label="Rezervasyon özeti">
        <article><span>Toplam talep</span><strong><?= $stats['total'] ?></strong></article>
        <article><span>Yeni</span><strong><?= $stats['new'] ?></strong></article>
        <article><span>Onaylanan</span><strong><?= $stats['confirmed'] ?></strong></article>
        <article><span>Yaklaşan tur</span><strong><?= $stats['upcoming'] ?></strong></article>
      </section>

      <section class="panel-card">
        <div class="panel-heading"><div><h2>Rezervasyon talepleri</h2><p>Web sitesinden gelen son 200 talep.</p></div><a class="secondary-button" href="./?export=csv">Excel için indir</a></div>
        <form class="filters" method="get"><input type="hidden" name="section" value="rezervasyonlar"><label><span>Arama</span><input name="q" value="<?= h($search) ?>" placeholder="İsim, telefon, e-posta veya tur"></label><label><span>Durum</span><select name="status"><option value="">Tümü</option><?php foreach ($allowedStatuses as $key => $label): ?><option value="<?= h($key) ?>" <?= $statusFilter === $key ? 'selected' : '' ?>><?= h($label) ?></option><?php endforeach; ?></select></label><button type="submit">Filtrele</button></form>

        <?php if (!$reservations): ?><div class="empty-state"><strong>Henüz rezervasyon bulunmuyor.</strong><p>Yeni talepler bu ekranda otomatik görünecek.</p></div><?php else: ?>
          <div class="table-wrap"><table><thead><tr><th>Talep</th><th>Misafir</th><th>Tur</th><th>Tarih / kişi</th><th>İletişim</th><th>Durum</th></tr></thead><tbody>
          <?php foreach ($reservations as $reservation): ?><tr>
            <td><strong>#<?= (int) $reservation['id'] ?></strong><small><?= h($reservation['created_at']) ?></small><?php if (!(int) $reservation['mail_sent']): ?><em>E-posta bekliyor</em><?php endif; ?></td>
            <td><strong><?= h($reservation['name']) ?></strong><?php if ($reservation['note'] !== ''): ?><small><?= h($reservation['note']) ?></small><?php endif; ?></td>
            <td><?= h($reservation['tour']) ?></td>
            <td><strong><?= h($reservation['tour_date']) ?></strong><small><?= (int) $reservation['travellers'] ?> kişi</small></td>
            <td><a href="tel:<?= h($reservation['phone']) ?>"><?= h($reservation['phone']) ?></a><a href="mailto:<?= h($reservation['email']) ?>"><?= h($reservation['email']) ?></a></td>
            <td><form method="post" class="status-form"><input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>"><input type="hidden" name="action" value="reservation_status"><input type="hidden" name="id" value="<?= (int) $reservation['id'] ?>"><select name="status" aria-label="#<?= (int) $reservation['id'] ?> durumunu değiştir"><?php foreach ($allowedStatuses as $key => $label): ?><option value="<?= h($key) ?>" <?= $reservation['status'] === $key ? 'selected' : '' ?>><?= h($label) ?></option><?php endforeach; ?></select><button type="submit">Kaydet</button></form></td>
          </tr><?php endforeach; ?>
          </tbody></table></div>
        <?php endif; ?>
      </section>

    <?php elseif ($section === 'turlar'): ?>
      <div class="section-intro"><div><h2>Öne çıkan turları düzenle</h2><p>Buradaki değişiklikler kaydedildiği anda gerçek sitedeki tur kartlarına yansır.</p></div><span><?= count($tours) ?> tur</span></div>
      <section class="tour-admin-grid">
        <?php foreach ($tours as $tour): ?><article class="tour-editor">
          <div class="tour-editor-image"><img src="/<?= h(ltrim((string) $tour['image'], './')) ?>" alt=""><span>#<?= (int) $tour['id'] ?></span></div>
          <form method="post">
            <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>"><input type="hidden" name="action" value="tour_update"><input type="hidden" name="section" value="turlar"><input type="hidden" name="id" value="<?= (int) $tour['id'] ?>">
            <div class="field-grid"><label class="wide"><span>Tur adı</span><input name="title" value="<?= h($tour['title']) ?>" required></label><label><span>Bölge</span><input name="location" value="<?= h($tour['location']) ?>" required></label><label><span>Kategori</span><input name="category" value="<?= h($tour['category']) ?>" required></label><label><span>Süre</span><input name="duration" value="<?= h($tour['duration']) ?>" required></label><label><span>Fiyat (₺)</span><input type="number" min="0" name="price" value="<?= (int) $tour['price'] ?>" required></label><label class="wide"><span>Rozet</span><input name="badge" value="<?= h($tour['badge'] ?? '') ?>"></label><label class="wide"><span>Kısa açıklama</span><textarea name="overview" rows="3" required><?= h($tour['overview']) ?></textarea></label><label><span>Öne çıkanlar — her satıra bir madde</span><textarea name="highlights" rows="4"><?= h(implode("\n", $tour['highlights'] ?? [])) ?></textarea></label><label><span>Program — her satıra bir adım</span><textarea name="itinerary" rows="4"><?= h(implode("\n", $tour['itinerary'] ?? [])) ?></textarea></label></div>
            <button class="save-button" type="submit">Turu kaydet</button>
          </form>
        </article><?php endforeach; ?>
      </section>

    <?php else: ?>
      <section class="panel-card settings-card">
        <div class="panel-heading"><div><h2>Panel şifresini değiştir</h2><p>En az 12 karakterden oluşan, başka yerde kullanmadığınız bir şifre seçin.</p></div></div>
        <form method="post" class="password-form"><input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>"><input type="hidden" name="action" value="password_change"><input type="hidden" name="section" value="ayarlar"><label>Mevcut şifre<input type="password" name="current_password" autocomplete="current-password" required></label><label>Yeni şifre<input type="password" name="new_password" minlength="12" autocomplete="new-password" required></label><label>Yeni şifre tekrar<input type="password" name="new_password_confirmation" minlength="12" autocomplete="new-password" required></label><button type="submit">Şifreyi değiştir</button></form>
        <div class="security-notes"><h3>Güvenlik korumaları</h3><ul><li>Oturum ve CSRF koruması</li><li>Şifrelenmiş parola saklama</li><li>Başarısız giriş denemesi sınırı</li><li>Arama motorlarından gizleme</li><li>Özel verileri web klasörü dışında saklama</li></ul></div>
      </section>
    <?php endif; ?>
  </main>
</body>
</html>
