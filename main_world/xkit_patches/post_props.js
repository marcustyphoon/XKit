export default function(post_id) {
	const keyStartsWith = (obj, prefix) =>
		Object.keys(obj).find(key => key.startsWith(prefix));
	const element = document.querySelector(`[data-id="${post_id}"]`);
	let fiber = element[keyStartsWith(element, '__reactFiber')];

	while (fiber.memoizedProps.timelineObject === undefined) {
		fiber = fiber.return;
	}
	return fiber.memoizedProps.timelineObject;
}
