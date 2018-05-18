/**
 * Parse, require and use process
 * command line arguments in your app.
 * Pattern: singleton
 */
class ArgumentSingleton
{
    private args: Object = {};

    readonly COLOR = {
        RED: '\x1b[31m',
        RESET: '\x1b[0m',
    };

    constructor()
    {
        this.args = this.parse(process.argv.slice(2));
    }

    public getArgs(): Object
    {
        return this.args;
    }

    public getArg(key: string): any
    {
        return this.exists(key) ? this.args[key] : null;
    }

    public exists(key: string): boolean
    {
        return typeof(this.args[key]) === 'undefined' ? false : true;
    }

    public require(key: string, allowed: Array<any> = [])
    {
        if (this.isNull(key) || this.isEmpty(key)) {
            console.log(this.COLOR.RED + '\Argument --'+ key +' is required'+ this.COLOR.RESET);
            process.exit(0);
        }

        if (allowed.length > 0 && allowed.indexOf(this.getArg(key)) === -1) {
            console.log(this.COLOR.RED + '\Argument value "'+ this.getArg(key) +'" for --'+ key +' is not allowed'+ this.COLOR.RESET);
            process.exit(0);
        }

        return this;
    }

    private isNull(key: string): boolean
    {
        return (!this.exists(key) || this.getArg(key) === null) ? true : false;
    }

    private isEmpty(key: string): boolean
    {
        return (!this.exists(key) || this.getArg(key) === '') ? true : false;
    }

    private parse(processArgv: Array<any>): Object
    {
        let list: Object = {};

        for (let argv of processArgv) {

            let exp = argv.split('='),
                key = exp[0].replace('--', ''),
                val = exp[1];

            list[key] = val;
        }

        return list;
    }
}

export let Argument = new ArgumentSingleton();
