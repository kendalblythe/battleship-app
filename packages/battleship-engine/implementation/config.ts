import { GridConfig } from '../types';
import { createEngineError, EngineErrorType } from './error';
import config from './config.json';

/**
 * Returns all grid configs.
 * @return All grid configs
 */
export const getGridConfigs = (): GridConfig[] => {
  return config.gridConfigs;
};

/**
 * Returns grid config by id.
 * @param gridConfigId Grid config id
 * @returns Grid config
 * @throws {EngineError} [
 *   EngineErrorType.gridConfigNotFound,
 * ]
 */
export const getGridConfig = (gridConfigId: string): GridConfig => {
  const gridConfig = getGridConfigs().find((gridConfig) => gridConfig.id === gridConfigId);
  if (!gridConfig) {
    throw createEngineError(EngineErrorType.gridConfigNotFound, [gridConfigId]);
  }
  return gridConfig;
};
