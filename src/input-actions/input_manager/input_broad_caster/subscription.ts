//!native
export default class Subscription {
	private subscribed_ = true;
	IsSubscribed() {
		return this.subscribed_;
	}

	public active = true;
	Disconnect() {
		this.subscribed_ = false;
	}
}
