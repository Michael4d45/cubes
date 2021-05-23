import {
	WebGLRenderer,
	XRSession,
	Navigator,
} from "three";

const nav = <Navigator>navigator;

class VRButton {

	static async createButton(renderer: WebGLRenderer, button: HTMLButtonElement) {

		function showEnterVR( /*device*/) {

			let currentSession: XRSession | null = null;

			async function onSessionStarted(session: XRSession) {

				session.addEventListener('end', onSessionEnded);

				await renderer.xr.setSession(session);
				button.textContent = 'EXIT VR';

				currentSession = session;

			}

			function onSessionEnded( /*event*/) {

				if (!currentSession) return;

				currentSession.removeEventListener('end', onSessionEnded);

				button.textContent = 'ENTER VR';

				currentSession = null;

			}

			button.style.display = 'inline';

			button.onclick = function () {
				if (!nav.xr) return;

				if (currentSession === null) {

					// WebXR's requestReferenceSpace only works if the corresponding feature
					// was requested at session creation time. For simplicity, just ask for
					// the interesting ones as optional features, but be aware that the
					// requestReferenceSpace call will fail if it turns out to be unavailable.
					// ('local' is always available for immersive sessions and doesn't need to
					// be requested separately.)

					const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] };
					nav.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);

				} else {

					currentSession.end();

				}

			};

		}

		if (nav.xr) {

			return await nav.xr.isSessionSupported('immersive-vr').then(function (supported: Boolean) {

				supported ? showEnterVR() : button.remove();

				return supported;

			});

		} else {

			button.remove();

			return false;

		}

	}

}

export { VRButton };