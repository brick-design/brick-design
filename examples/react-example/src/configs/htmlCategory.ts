import { CategoryType } from '@brickd/react-web'

export const htmlContainers: CategoryType = {
	HTMLTag: {
		span: 24,
		components: {
			div: null,
			a: null,
			span: null,
			del:null
		},
	},
}

export const htmlNonContainers: CategoryType = {
	HTMLTag: {
		components: {
			img: {
				props: [
					{
						style: { height: '100%' },
						src:
							'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1191630624,1109312732&fm=26&gp=0.jpg',
					},
				],
			},
		},
	},
}
