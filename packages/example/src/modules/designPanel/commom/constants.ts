import {flattenDeepArray} from "@/utils";
import config from "@/configs";

export const stateSelector=['selectedInfo', 'hoverKey','componentConfigs']
export const containers = flattenDeepArray(config.CONTAINER_CATEGORY);
