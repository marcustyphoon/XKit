"use strict";

{
	const moduleCache = {};

	window.removeNewXKitListener?.();

	const controller = new AbortController();
	window.removeNewXKitListener = () => controller.abort();

	document.documentElement.addEventListener("newxkitinjectionrequest", async event => {
		const {detail, target} = event;
		const {id, path, args} = JSON.parse(detail);

		try {
			if (!moduleCache[path]) {
				moduleCache[path] = await import(path);
			}
			const func = moduleCache[path].default;

			if (target.isConnected === false) return;

			const result = await func.apply(target, args);
			target.dispatchEvent(
				new CustomEvent("newxkitinjectionresponse", {
					detail: JSON.stringify({id, result}),
				})
			);
		} catch (exception) {
			target.dispatchEvent(
				new CustomEvent("newxkitinjectionresponse", {
					detail: JSON.stringify({
						id,
						exception: {
							message: exception.message,
							name: exception.name,
							stack: exception.stack,
							...exception,
						},
					}),
				})
			);
		}
	}, { signal: controller.signal });

	document.documentElement.dispatchEvent(new CustomEvent('newxkitinjectionready'));
}
