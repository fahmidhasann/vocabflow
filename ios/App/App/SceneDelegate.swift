import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        connectionOptions.urlContexts.forEach(handle)
        connectionOptions.userActivities.forEach(handle)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        URLContexts.forEach(handle)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        handle(userActivity)
    }

    private func handle(_ urlContext: UIOpenURLContext) {
        var options: [UIApplication.OpenURLOptionsKey: Any] = [:]

        if let sourceApplication = urlContext.options.sourceApplication {
            options[.sourceApplication] = sourceApplication
        }

        if let annotation = urlContext.options.annotation {
            options[.annotation] = annotation
        }

        options[.openInPlace] = urlContext.options.openInPlace

        _ = ApplicationDelegateProxy.shared.application(
            UIApplication.shared,
            open: urlContext.url,
            options: options
        )
    }

    private func handle(_ userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(
            UIApplication.shared,
            continue: userActivity
        ) { _ in }
    }
}
