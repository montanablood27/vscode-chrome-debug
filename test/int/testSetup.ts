/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as tmp from 'tmp';

import * as ts from 'vscode-chrome-debug-core-testsupport';

const DEBUG_ADAPTER = './out/src/chromeDebug.js';

let testLaunchProps: any;

function formLaunchArgs(launchArgs: any): void {
    launchArgs.trace = 'verbose';
    launchArgs.disableNetworkCache = true;

    // Start with a clean userDataDir for each test run
    const tmpDir = tmp.dirSync({ prefix: 'chrome2-' });
    launchArgs.userDataDir = tmpDir.name;
    if (testLaunchProps) {
        for (let key in testLaunchProps) {
            launchArgs[key] = testLaunchProps[key];
        }
        testLaunchProps = undefined;
    }
}

function patchLaunchArgs(launchArgs: any): void {
    formLaunchArgs(launchArgs);
}

export const lowercaseDriveLetterDirname = __dirname.charAt(0).toLowerCase() + __dirname.substr(1);
export const PROJECT_ROOT = path.join(lowercaseDriveLetterDirname, '../../../');
export const DATA_ROOT = path.join(PROJECT_ROOT, 'testdata/');

export function setup(port?: number, launchProps?: any) {
    if (launchProps) {
        testLaunchProps = launchProps;
    }
    return ts.setup({ entryPoint: DEBUG_ADAPTER, type: 'chrome', patchLaunchArgs: patchLaunchArgs, port: port });
}

export async function teardown() {
    await ts.teardown();
}
