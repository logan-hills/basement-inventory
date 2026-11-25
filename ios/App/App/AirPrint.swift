import UIKit
import Capacitor
import WebKit

/// The app's main screen. Same as Capacitor's own, plus our AirPrint plugin.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(AirPrintPlugin())
    }
}

/// AirPrint for the iPhone and iPad app. The web page's Print buttons (window.print) don't work inside an app,
/// so the page calls this instead: it opens Apple's print sheet for the current page, using its print layout,
/// on paper that matches the label size when the printer has it.
@objc(AirPrintPlugin)
public class AirPrintPlugin: CAPPlugin, CAPBridgedPlugin, UIPrintInteractionControllerDelegate {
    public let identifier = "AirPrintPlugin"
    public let jsName = "AirPrint"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "printPage", returnType: CAPPluginReturnPromise)
    ]

    /// The page size the label page asks for, in points (72 per inch). Zero means let the printer choose.
    private var wanted = CGSize.zero

    @objc func printPage(_ call: CAPPluginCall) {
        let w = call.getDouble("w") ?? 0, h = call.getDouble("h") ?? 0
        let name = call.getString("name") ?? "Dazzle Warehouse"
        DispatchQueue.main.async {
            guard let web = self.bridge?.webView else { call.reject("There's no page to print."); return }
            self.wanted = (w > 0 && h > 0) ? CGSize(width: w * 72, height: h * 72) : .zero
            let info = UIPrintInfo(dictionary: nil)
            info.outputType = .general
            info.jobName = name
            info.orientation = .portrait
            let pc = UIPrintInteractionController.shared
            pc.printInfo = info
            pc.delegate = self
            pc.printFormatter = web.viewPrintFormatter()
            let done: UIPrintInteractionController.CompletionHandler = { _, completed, error in
                if let error = error { call.reject(error.localizedDescription) } else { call.resolve(["printed": completed]) }
            }
            if UIDevice.current.userInterfaceIdiom == .pad, let view = self.bridge?.viewController?.view {
                pc.present(from: CGRect(x: view.bounds.midX, y: view.bounds.maxY - 80, width: 1, height: 1), in: view, animated: true, completionHandler: done)
            } else {
                pc.present(animated: true, completionHandler: done)
            }
        }
    }

    public func printInteractionController(_ printInteractionController: UIPrintInteractionController, choosePaper paperList: [UIPrintPaper]) -> UIPrintPaper {
        if wanted == .zero { return paperList.first ?? UIPrintPaper.bestPaper(forPageSize: CGSize(width: 612, height: 792), withPapersFrom: paperList) }
        return UIPrintPaper.bestPaper(forPageSize: wanted, withPapersFrom: paperList)
    }
}
