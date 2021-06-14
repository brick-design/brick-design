import React, { useState } from 'react'
import styles from './index.less'
import { BrickDesignLeft } from '@brickd/react-web'
import { CONTAINER_CATEGORY, NON_CONTAINER_CATEGORY } from './configs'


function AllComponents() {
	return (
		<BrickDesignLeft componentsCategory={CONTAINER_CATEGORY}/>
	)
}

export default AllComponents
