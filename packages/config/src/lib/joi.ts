import * as Joi from 'joi';
import { Schema, SchemaMap } from 'joi';

interface ConfigProps {
  value: unknown;
  joi: Schema;
}

export type JoiConfig<T> = Record<keyof T, ConfigProps>;

/**
 * Utility class to avoid duplicating code in the configuration of our modules.
 */
export class JoiUtil {
  /**
   * Throws an exception if required environment variables haven't been provided
   * or if they don't meet our Joi validation rules.
   */
  static validate<T>(config: JoiConfig<T>): T {
    const schemaObj = JoiUtil.extractByPropName(config, 'joi') as SchemaMap<T>;
    const schema = Joi.object(schemaObj).default();
    const values = JoiUtil.extractByPropName(config, 'value') as T;

    const { error, value: validateValues } = schema.validate(values);
    if (error) {
      throw new Error(
        `Validation failed - Is there an environment variable missing?
        ${error.message}`
      );
    }

    return validateValues;
  }

  /**
   * Extract only a single property from our configuration object.
   * @param config    Entire configuration object.
   * @param propName  The property name that we want to extract.
   */
  static extractByPropName<T>(
    config: JoiConfig<T>,
    propName: keyof ConfigProps
  ): T | SchemaMap<T> {
    const arr = Object.keys(config).map((key) => {
      return {
        [key]: config[key as keyof JoiConfig<T>][propName],
      };
    });

    return Object.assign({}, ...arr);
  }
}
