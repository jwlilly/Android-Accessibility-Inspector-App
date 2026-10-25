// Builds the companion Accessibility Inspector Service app and copies the APK and its
// version into assets/adb so the inspector can install it and check the installed version.
//
// SERVICE_REPO overrides the location of the service project
// (default: ../Accessibility-Inspector-Service next to this repo).
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const serviceRepo = path.resolve(
  process.env.SERVICE_REPO ||
    path.join(root, '..', 'Accessibility-Inspector-Service'),
);
const adbAssets = path.join(root, 'assets', 'adb');
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

if (!fs.existsSync(path.join(serviceRepo, 'settings.gradle'))) {
  console.error(
    `Service project not found at ${serviceRepo}. Set SERVICE_REPO.`,
  );
  process.exit(1);
}

execFileSync(gradlew, ['assembleDebug'], {
  cwd: serviceRepo,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const outputDir = path.join(serviceRepo, 'app/build/outputs/apk/debug');
const metadata = JSON.parse(
  fs.readFileSync(path.join(outputDir, 'output-metadata.json'), 'utf8'),
);
const [element] = metadata.elements;

fs.copyFileSync(
  path.join(outputDir, element.outputFile),
  path.join(adbAssets, 'app-debug.apk'),
);
fs.writeFileSync(
  path.join(adbAssets, 'companion-version.json'),
  `${JSON.stringify(
    { versionCode: element.versionCode, versionName: element.versionName },
    null,
    2,
  )}\n`,
);
console.log(
  `Bundled companion app ${element.versionName} (${element.versionCode})`,
);
