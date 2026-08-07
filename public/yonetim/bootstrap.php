<?php
declare(strict_types=1);

function coltur_admin_config_path(): string
{
    return dirname(__DIR__, 2) . '/.coltur-admin.php';
}

function coltur_admin_config(): array
{
    static $config = null;
    if (is_array($config)) {
        return $config;
    }

    $path = coltur_admin_config_path();
    if (!is_file($path)) {
        throw new RuntimeException('Yönetim paneli güvenlik ayarları bulunamadı.');
    }

    $loaded = require $path;
    if (!is_array($loaded)) {
        throw new RuntimeException('Yönetim paneli güvenlik ayarları geçersiz.');
    }

    $username = trim((string) ($loaded['username'] ?? ''));
    $passwordHash = (string) ($loaded['password_hash'] ?? '');
    $dataDir = rtrim((string) ($loaded['data_dir'] ?? ''), '/');

    if ($username === '' || $passwordHash === '' || $dataDir === '') {
        throw new RuntimeException('Yönetim paneli güvenlik ayarları eksik.');
    }

    $config = [
        'username' => $username,
        'password_hash' => $passwordHash,
        'data_dir' => $dataDir,
    ];

    return $config;
}

function coltur_database(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = coltur_admin_config();
    $dataDir = $config['data_dir'];

    if (!is_dir($dataDir) && !mkdir($dataDir, 0700, true) && !is_dir($dataDir)) {
        throw new RuntimeException('Özel veri klasörü oluşturulamadı.');
    }

    $denyFile = $dataDir . '/.htaccess';
    if (!is_file($denyFile)) {
        @file_put_contents($denyFile, "Require all denied\nDeny from all\n", LOCK_EX);
        @chmod($denyFile, 0600);
    }

    $databasePath = $dataDir . '/coltur.sqlite';
    $pdo = new PDO('sqlite:' . $databasePath, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec('PRAGMA busy_timeout = 5000');
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            tour TEXT NOT NULL,
            tour_date TEXT NOT NULL,
            travellers INTEGER NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            note TEXT NOT NULL DEFAULT \'\',
            status TEXT NOT NULL DEFAULT \'new\',
            mail_sent INTEGER NOT NULL DEFAULT 0
        )'
    );
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_reservations_tour_date ON reservations(tour_date)');
    $pdo->exec('PRAGMA optimize');
    @chmod($databasePath, 0600);

    return $pdo;
}

function coltur_store_reservation(array $reservation): int
{
    $pdo = coltur_database();
    $statement = $pdo->prepare(
        'INSERT INTO reservations
        (created_at, tour, tour_date, travellers, name, email, phone, note, status, mail_sent)
        VALUES (:created_at, :tour, :tour_date, :travellers, :name, :email, :phone, :note, \'new\', 0)'
    );
    $statement->execute([
        ':created_at' => (new DateTimeImmutable('now', new DateTimeZone('Europe/Istanbul')))->format('Y-m-d H:i:s'),
        ':tour' => $reservation['tour'],
        ':tour_date' => $reservation['date'],
        ':travellers' => $reservation['travellers'],
        ':name' => $reservation['name'],
        ':email' => $reservation['email'],
        ':phone' => $reservation['phone'],
        ':note' => $reservation['note'],
    ]);

    return (int) $pdo->lastInsertId();
}

function coltur_mark_reservation_mailed(int $id): void
{
    if ($id < 1) {
        return;
    }

    $statement = coltur_database()->prepare('UPDATE reservations SET mail_sent = 1 WHERE id = :id');
    $statement->execute([':id' => $id]);
}

function coltur_tours_path(): string
{
    return dirname(__DIR__) . '/data/tours.json';
}

function coltur_read_tours(): array
{
    $path = coltur_tours_path();
    $json = is_file($path) ? file_get_contents($path) : false;
    $tours = is_string($json) ? json_decode($json, true) : null;
    return is_array($tours) ? $tours : [];
}

function coltur_write_tours(array $tours): void
{
    $path = coltur_tours_path();
    $directory = dirname($path);
    if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
        throw new RuntimeException('Tur veri klasörü oluşturulamadı.');
    }

    $encoded = json_encode($tours, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($encoded)) {
        throw new RuntimeException('Tur verisi hazırlanamadı.');
    }

    $temporary = $path . '.tmp';
    if (file_put_contents($temporary, $encoded . "\n", LOCK_EX) === false) {
        throw new RuntimeException('Tur verisi kaydedilemedi.');
    }

    @chmod($temporary, 0644);
    if (!rename($temporary, $path)) {
        @unlink($temporary);
        throw new RuntimeException('Tur verisi yayına alınamadı.');
    }
}

function coltur_write_admin_config(string $username, string $passwordHash, string $dataDir): void
{
    $path = coltur_admin_config_path();
    $contents = "<?php\ndeclare(strict_types=1);\n\nreturn " . var_export([
        'username' => $username,
        'password_hash' => $passwordHash,
        'data_dir' => $dataDir,
    ], true) . ";\n";

    $temporary = $path . '.tmp';
    if (file_put_contents($temporary, $contents, LOCK_EX) === false) {
        throw new RuntimeException('Güvenlik ayarları güncellenemedi.');
    }
    @chmod($temporary, 0600);
    if (!rename($temporary, $path)) {
        @unlink($temporary);
        throw new RuntimeException('Güvenlik ayarları etkinleştirilemedi.');
    }
}
