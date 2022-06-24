import { Topping } from '../../components/composable/hamburger/Topping';
import { AbstractHydrator } from './AbstractHydrator';
import {
	home,
	face,
	visibility,
	call,
} from '!i/twotone::home,face,visibility,call';

export class ToppingsHydrator extends AbstractHydrator<Topping[]> {
	constructor(
		out: Topping[],
		private goto: (href: string, opts?: any) => Promise<void>,
	) {
		super(out);
	}

	/** @stub */
	public async hydrate() {
		this.out[0] = Topping.from({
			svg: home,
			name: 'Home'.toUpperCase(),
			action: () => {
				void this.goto('/');
			},
		});
		this.out[1] = Topping.from({
			svg: face,
			name: 'About'.toUpperCase(),
			action: () => {
				void this.goto('/about');
			},
		});
		this.out[2] = Topping.from({
			svg: visibility,
			name: 'Portfolio'.toUpperCase(),
			action: () => {
				void this.goto('/portfolio');
			},
		});
		this.out[3] = Topping.from({
			svg: call,
			name: 'Contact'.toUpperCase(),
			action: () => {
				void this.goto('/contact');
			},
		});

		this.brand();
	}
}
