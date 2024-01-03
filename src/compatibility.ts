/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Flags } from '@oclif/core';
import { Lifecycle, Messages } from '@salesforce/core';
import { orgApiVersionFlag } from './flags/orgApiVersion.js';
import { optionalHubFlag, optionalOrgFlag, requiredHubFlag, requiredOrgFlag } from './flags/orgFlags.js';

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

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
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
  required: true,
});

/**
 * @deprecated
 */
export const requiredHubFlagWithDeprecations = requiredHubFlag({
  aliases: ['targetdevhubusername'],
  deprecateAliases: true,
  required: true,
});

/**
 * @deprecated
 */
export const optionalHubFlagWithDeprecations = optionalHubFlag({
  aliases: ['targetdevhubusername'],
  deprecateAliases: true,
  required: false,
});

export type ArrayWithDeprecationOptions = {
  // prevent invalid options from being passed
  multiple?: true;
  // parse is disallowed because we have to overwrite it
  parse?: undefined;
};
/**
 * @deprecated
 */
export const arrayWithDeprecation = Flags.custom<string[], ArrayWithDeprecationOptions>({
  multiple: true,
  delimiter: ',',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error parse expects to return string[] but we need to return string.
  // This is a weird consequence of implementing an array flag. The oclif parser splits the input (e.g. "thing1,thing2")
  // on the delimiter and passes each value individually to the parse function. However, the return type needs to be
  // string[] so that upstream consumers have the correct flag typings.
  parse: async (input, ctx) => {
    const inputParts = ctx.token.input.split(',').map((i) => i.trim());
    if (inputParts.length > 1) {
      await Lifecycle.getInstance().emitWarning(messages.getMessage('warning.arrayInputFormat'));
    }

    return input;
  },
});
