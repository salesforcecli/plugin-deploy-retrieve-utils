/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Flags } from '@oclif/core';
import { Messages } from '@salesforce/core';
import { orgApiVersionFlag } from './flags/orgApiVersion';
import { optionalOrgFlag, requiredHubFlag, requiredOrgFlag } from './flags/orgFlags';

/**
 * Adds an alias for the deprecated sfdx-style "apiversion" and provides a warning if it is used
 * See orgApiVersionFlag for full details
 *
 * @deprecated
 * @example
 * ```
 * import { Flags } from '@salesforce/sf-plugins-core';
 * public static flags = {
 *    'api-version': Flags.orgApiVersion({
 *       char: 'a',
 *       description: 'api version for the org'
 *    }),
 * }
 * ```
 */
export const orgApiVersionFlagWithDeprecations = orgApiVersionFlag({
  aliases: ['apiversion'],
  deprecateAliases: true,
});

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/sf-plugins-core', 'messages');
/**
 * Use only for commands that maintain sfdx compatibility.
 * Flag will be hidden and will show a warning if used.
 * Flag does *not* set the loglevel
 *
 * @deprecated
 *
 */
export const loglevel = Flags.string({
  hidden: true,
  deprecated: {
    message: messages.getMessage('warning.loglevel'),
  },
});

const deprecatedOrgAliases = {
  aliases: ['targetusername', 'u'],
  deprecateAliases: true,
};

/**
 * @deprecated
 */
export const optionalOrgFlagWithDeprecations = optionalOrgFlag({
  ...deprecatedOrgAliases,
});

/**
 * @deprecated
 */
export const requiredOrgFlagWithDeprecations = requiredOrgFlag({
  ...deprecatedOrgAliases,
});

/**
 * @deprecated
 */
export const requiredHubFlagWithDeprecations = requiredHubFlag({
  aliases: ['targetdevhubusername'],
  deprecateAliases: true,
});
