import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const env = { ...process.env };

if (process.platform === 'win32') {
  const sdk = env.ANDROID_HOME || join(env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'Android', 'Sdk');
  const emulator = join(sdk, 'emulator', 'emulator.exe');
  const adb = join(sdk, 'platform-tools', 'adb.exe');

  if (!existsSync(emulator) || !existsSync(adb)) {
    console.error(`Android SDK tools were not found in ${sdk}. Install them with Android Studio or set ANDROID_HOME.`);
    process.exit(1);
  }

  env.ANDROID_HOME = sdk;
  env.ANDROID_AVD_HOME ||= join(homedir(), '.android', 'avd');
  env.Path = [join(sdk, 'emulator'), join(sdk, 'platform-tools'), env.Path || env.PATH || ''].join(';');

  const devices = spawnSync(adb, ['devices'], { env, encoding: 'utf8' });
  if (devices.stdout?.includes('unauthorized')) {
    console.log('Restarting ADB to authorize the emulator...');
    spawnSync(adb, ['kill-server'], { env, stdio: 'inherit' });
    spawnSync(adb, ['start-server'], { env, stdio: 'inherit' });
  }
}

const expo = spawn(process.execPath, [join('node_modules', 'expo', 'bin', 'cli'), 'start', '--android'], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});
expo.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
expo.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
