class ConfigSingleton
{
    public config: any;

    all()
    {
        return this.config;
    }

    get(key: string)
    {
        return (typeof this.config[key] === 'undefined') ? null : this.config[key];
    }

    init(config: any)
    {
        this.config = config;
        return this;
    }
}

export let Config = new ConfigSingleton()
