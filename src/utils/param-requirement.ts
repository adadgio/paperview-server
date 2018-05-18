type RequiredParamType = {
    [key: string]: Array<string>;
}

export class ParamRequirement
{
    private input: RequiredParamType;
    private requirements: any;

    constructor(input: any)
    {
        this.input = input;
    }

    require(requirements: Array<RequiredParamType>)
    {
        this.requirements = requirements;
        return this;
    }
    resolve(): string|false
    {
        for (let i in this.requirements) {

            let requirement = this.requirements[i]
            
            let key = Object.keys(requirement)[0]
            let allowedTypes = requirement[key];
            let paramValueType = typeof(this.input[key]);

            // check missing parameters
            if (paramValueType === 'undefined') {
                return `parameter <${key}> is required and must be a [${allowedTypes.join('|')}]`;
            }

            // check null or empty parameters
            if (this.input[key].toString().trim() === '' && allowedTypes.indexOf('notempty') > -1) {
                return `parameter <${key}> cannot be empty`;
            }

            // check null or empty parameters
            if (this.input[key] === null && allowedTypes.indexOf('null') === -1) {
                return `parameter <${key}> cannot be null`;
            }

            // check parameters types
            if (allowedTypes.indexOf(paramValueType) === -1) {
                return `parameter <${key}> must be a [${allowedTypes.join('|')}]`;
            }
        }

        return false;
    }
}
