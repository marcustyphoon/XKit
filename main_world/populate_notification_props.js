export default async function populateNotificationProps() {
	const keyStartsWith = (obj, prefix) =>
		Object.keys(obj).find(key => key.startsWith(prefix));

	const cssMap = await window.tumblr.getCssMap();
	const elements = document.querySelectorAll(
		cssMap.notification.map(cls => `.${cls}:not([data-target-id])`).join(",")
	);

	elements.forEach(element => {
		let fiber = element[keyStartsWith(element, "__reactFiber")];
		const notificationProp = () => fiber.memoizedProps && fiber.memoizedProps.notification;

		while (fiber && !notificationProp()) {
			fiber = fiber.return;
		}

		if (fiber) {
			const {targetPostId} = notificationProp();
			element.dataset.targetId = targetPostId;
		}
	});
}
