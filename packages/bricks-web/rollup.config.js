import {createConfig} from '../../scripts/create.rollup.config'

const external=["brickd-core","react","react-dom","lodash",'antd','react-color','sortablejs']
export default createConfig(external,'BricksWeb')
