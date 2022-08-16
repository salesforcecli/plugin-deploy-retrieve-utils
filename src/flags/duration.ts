/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { Flags, Interfaces } from '@oclif/core';
import { Messages } from '@salesforce/core';
import { Duration } from '@salesforce/kit';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/sf-plugins-core', 'messages');

type DurationUnit = Lowercase<keyof typeof Duration.Unit>;

export interface DurationFlagConfig extends Partial<Interfaces.OptionFlag<Duration>> {
  unit: Required<DurationUnit>;
  defaultValue?: number;
  min?: number;
  max?: number;
}

/**
 * Duration flag with built-in default and min/max validation
 * You must specify a unit
 * Defaults to undefined if you don't specify a default
 *
 * @example
 * import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
 * public static flags = {
 *    'wait': duration({
 *       min: 1,
 *       unit: 'minutes'
 *       defaultValue: 33,
 *       char: 'w',
 *       description: 'Wait time in minutes'
 *    }),
 * }
 */
export function durationFlag(
  durationConfig: DurationFlagConfig & ({ required: true } | { default: Interfaces.Default<Duration> })
): Interfaces.OptionFlag<Duration>;
export function durationFlag(durationConfig: DurationFlagConfig): Interfaces.OptionFlag<Duration | undefined>;
export function durationFlag(
  durationConfig: DurationFlagConfig
): Interfaces.OptionFlag<Duration> | Interfaces.OptionFlag<Duration | undefined> {
  const { defaultValue, min, max, unit, ...baseProps } = durationConfig;
  return Flags.build({
    ...baseProps,
    parse: async (input: string) => validate(input, { min, max, unit }),
    default: defaultValue ? async () => toDuration(defaultValue, unit) : undefined,
  })();
}

const validate = (input: string, config: DurationFlagConfig): Duration => {
  const { min, max, unit } = config || {};
  let parsedInput: number;

  try {
    parsedInput = parseInt(input, 10);
    if (typeof parsedInput !== 'number' || isNaN(parsedInput)) {
      throw messages.createError('errors.InvalidDuration');
    }
  } catch (e) {
    throw messages.createError('errors.InvalidDuration');
  }

  if (min && parsedInput < min) {
    throw messages.createError('errors.DurationBounds', [min, max]);
  }
  if (max && parsedInput > max) {
    throw messages.createError('errors.DurationBounds', [min, max]);
  }
  return toDuration(parsedInput, unit);
};

const toDuration = (parsedInput: number, unit: DurationUnit): Duration => Duration[unit](parsedInput);
