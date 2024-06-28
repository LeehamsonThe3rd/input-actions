//!native
import Subscription from "./subscription";

//at the end returns whether to sink the input or no
export default class InputBroadCaster<Callback extends (...args: any[]) => Enum.ContextActionResult | void> {
	private callbacks_: [Callback, priority: number][] = [];
	private subscriptions_: Subscription[] = [];

	private new_callbacks_: [Callback, priority: number][] = [];
	private new_subscriptions_: Subscription[] = [];

	Subscribe(callback: Callback, priority: number = 1) {
		const subscription = new Subscription();
		//creates new subscription and returns it back
		this.new_callbacks_.push([callback, priority]);
		this.new_subscriptions_.push(subscription);
		//returns new subscription
		return subscription;
	}

	/**returns sorted copy of callbacks by priority */
	//Could be optimized
	GetCallbacks() {
		const cloned_callbacks = table.clone(this.callbacks_);
		//removes inactive subsriptions
		for (const i of $range(cloned_callbacks.size() - 1, 0, -1)) {
			const subscription = this.subscriptions_[i];
			if (!subscription.active) cloned_callbacks.remove(i);
		}

		return cloned_callbacks;
	}

	private GetIndexForPriority(priority: number) {
		const amount_of_callbacks = this.callbacks_.size();
		for (const i of $range(0, amount_of_callbacks - 1)) {
			const [_, callback_priority] = this.callbacks_[i];
			if (priority <= callback_priority) continue;
			//return the index of the place where it can fit sorted
			return i;
		}
		//if the loop didnt return anything, return the laast index
		return amount_of_callbacks;
	}

	CheckNewAndUnsubscribed() {
		if (this.new_subscriptions_.size() !== 0) {
			//unites the tables with new subcriptions
			for (const i of $range(0, this.new_subscriptions_.size() - 1)) {
				//takes new subscription and callback and it will insert sorted;
				const subscription = this.new_subscriptions_[i];
				const callback_tuple = this.new_callbacks_[i];
				//1 - priority
				const index = this.GetIndexForPriority(callback_tuple[1]);
				//inserts on calculated sorted place
				this.subscriptions_.insert(index, subscription);
				this.callbacks_.insert(index, callback_tuple);
			}
			//clears the tables
			this.new_subscriptions_.clear();
			this.new_callbacks_.clear();
		}

		//goes backwards and removes all unsubscribed callbacks
		for (const i of $range(this.callbacks_.size() - 1, 0, -1)) {
			if (this.subscriptions_[i].IsSubscribed()) continue;
			this.callbacks_.remove(i);
			this.subscriptions_.remove(i);
		}
	}
}
