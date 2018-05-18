export function defaultOption(opts: any, key: string, defaultValue: any)
{
    return (typeof opts === 'undefined' || typeof opts[key] === 'undefined') ? defaultValue : opts[key];
}
