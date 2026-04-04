import fs from 'fs';
try {
    console.log('Attempting import...');
    await import('./src/server.js');
    console.log('Import success');
    fs.writeFileSync('debug_import.txt', 'success');
} catch (e) {
    console.error('Import failed:', e);
    fs.writeFileSync('debug_import.txt', 'error: ' + e.message + '\n' + e.stack);
}
