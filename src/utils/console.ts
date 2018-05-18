import * as fse     from 'fs-extra';
import * as path    from 'path';
import * as moment  from 'moment';
import { Config }   from '../environments/config';

/**
 * Display nice colored console messages.
 */
class ConsoleSingleton
{
    Reset       = '\x1b[0m';
    Bright      = '\x1b[1m';
    Dim         = '\x1b[2m';
    Underscore  = '\x1b[4m';
    Blink       = '\x1b[5m';
    Reverse     = '\x1b[7m';
    Hidden      = '\x1b[8m';

    FgBlack     = '\x1b[30m';
    FgRed       = '\x1b[31m';
    FgGreen     = '\x1b[32m';
    FgYellow    = '\x1b[33m';
    FgBlue      = '\x1b[34m';
    FgMagenta   = '\x1b[35m';
    FgCyan      = '\x1b[36m';
    FgWhite     = '\x1b[37m';
    FgLitGray  =  '\x1b[90m';

    BgBlack     = '\x1b[40m';
    BgRed       = '\x1b[41m';
    BgGreen     = '\x1b[42m';
    BgYellow    = '\x1b[43m';
    BgBlue      = '\x1b[44m';
    BgMagenta   = '\x1b[45m';
    BgCyan      = '\x1b[46m';
    BgWhite     = '\x1b[47m';

    private env: string;

    constructor()
    {

    }

    white(text: string|number): void
    {
        console.log('\x1b[37m%s\x1b[0m', text)
    }

    red(text: string|number): void
    {
        console.log('\x1b[31m%s\x1b[0m', text)
    }

    info(text: string|number): void
    {
        this.lite(text)
    }

    warn(text: string|number): void
    {
        console.log('\x1b[33m%s\x1b[0m', text)
    }

    error(text: string|number, quit: number = null): void
    {
        console.log('\x1b[31m%s\x1b[0m', text)
        if (1 === quit) { process.exit(0); } // process will be reforked
    }

    magenta(text: string|number): void
    {
        console.log('\x1b[35m%s\x1b[0m', text)
    }

    comment(text: string|number): void
    {
        console.log('\x1b[35m%s\x1b[0m', text)
    }

    cyan(text: string|number): void
    {
        console.log('\x1b[36m%s\x1b[0m', text)
    }

    blue(text: string|number): void
    {
        console.log('\x1b[44m%s\x1b[0m', text)
    }

    gray(text: string|number): void
    {
        console.log('\x1b[97m%s\x1b[0m', text)
    }

    lite(text: string|number): void
    {
        console.log('\x1b[90m%s\x1b[0m', text)
    }

    exception(text: string|number): void
    {
        console.log('\x1b[41m%s\x1b[0m', text)
        throw new Error('Exception error throw');
    }
}

export let Console = new ConsoleSingleton()
