import type { SelectHTMLAttributes } from 'react';

type TimezoneSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  includeEmptyOption?: boolean;
};

type TimezoneOption = {
  value: string;
  label: string;
  offsetMinutes: number;
};

const TIMEZONE_OPTIONS = buildTimezoneOptions();

export function TimezoneSelect({
  includeEmptyOption = true,
  className,
  ...props
}: TimezoneSelectProps) {
  return (
    <select {...props} className={className}>
      {includeEmptyOption ? <option value="">Seleccionar timezone</option> : null}
      {TIMEZONE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function buildTimezoneOptions(): TimezoneOption[] {
  const zones = getSupportedTimezones();
  const options = zones.map((zone) => {
    const normalizedOffset = getNormalizedOffset(zone);
    const offsetMinutes = getOffsetMinutes(normalizedOffset);
    return {
      value: zone,
      label: `(GMT${normalizedOffset}) ${zone.replaceAll('_', ' ')}`,
      offsetMinutes,
    };
  });

  options.sort((a, b) => {
    if (a.offsetMinutes !== b.offsetMinutes) return a.offsetMinutes - b.offsetMinutes;
    return a.value.localeCompare(b.value);
  });

  return options;
}

function getSupportedTimezones(): string[] {
  try {
    const intlWithSupportedValuesOf = Intl as typeof Intl & {
      supportedValuesOf?: (key: string) => string[];
    };
    const values = intlWithSupportedValuesOf.supportedValuesOf?.('timeZone');
    if (values?.length) return values;
  } catch {
    // Fallback en runtimes sin Intl.supportedValuesOf.
  }

  return ['UTC'];
}

function getNormalizedOffset(timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(new Date());

    const rawOffset = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';
    return normalizeOffset(rawOffset);
  } catch {
    return '+00:00';
  }
}

function normalizeOffset(rawOffset: string): string {
  if (rawOffset === 'GMT' || rawOffset === 'UTC') return '+00:00';

  const matched = rawOffset.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!matched) return '+00:00';

  const [, sign, hour, minute] = matched;
  return `${sign}${hour.padStart(2, '0')}:${(minute ?? '00').padStart(2, '0')}`;
}

function getOffsetMinutes(normalizedOffset: string): number {
  const matched = normalizedOffset.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!matched) return 0;

  const [, sign, hours, minutes] = matched;
  const absoluteMinutes = Number(hours) * 60 + Number(minutes);
  return sign === '-' ? -absoluteMinutes : absoluteMinutes;
}
