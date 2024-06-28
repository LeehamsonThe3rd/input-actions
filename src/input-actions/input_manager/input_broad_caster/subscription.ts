//!native
export default class Subscription {
	private subscribed_ = true;
	public active = true;

	SetActive(value: boolean) {
		this.active = value;
	}

	Unsubscribe() {
		this.subscribed_ = false;
	}

	IsSubscribed() {
		return this.subscribed_;
	}
}
