//
//  ShareViewController.swift
//  HydrantShare
//
//  Created by Josh Justice on 11/20/17.
//  Copyright © 2017 NeedBee. All rights reserved.
//

import UIKit
import Social

enum ShareError: LocalizedError {
    case urlNotFound
    
    var errorDescription: String? {
        switch self {
        case .urlNotFound: return "URL not found"
        }
    }
}

class ShareViewController: SLComposeServiceViewController {

    private let webhookURL = Config.webhookURL
    private let apiKey = Config.apiKey
    
    private let attachmentHandler = AttachmentHandler()
    
    override func isContentValid() -> Bool {
        // Do validation of contentText and/or NSExtensionContext attachments here
        return true
    }
    
    private func getURLAttachment(completion: @escaping (Result<URL>) -> Void) {
        guard let context = extensionContext,
            let items = context.inputItems as? [NSExtensionItem],
            let item = items.first,
            let attachments = item.attachments else
        {
                completion(.failure(ShareError.urlNotFound))
                return
        }

        attachmentHandler.getURL(attachments: attachments, completion: completion)
    }
    
    private func postWebhook(bodyDict: [String: String?], completion: @escaping () -> Void) {
        let sessionConfig = URLSessionConfiguration.default
        sessionConfig.timeoutIntervalForRequest = 5.0 // seconds
        let session = URLSession(configuration: sessionConfig)
        
        var request = URLRequest(url: webhookURL)
        var bodyData: Data
        do {
            bodyData = try JSONSerialization.data(withJSONObject: bodyDict, options: [])
        } catch {
            self.alert(message: "A service error occurred", completion: completion)
            return
        }
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.httpMethod = "POST";
        request.httpBody = bodyData;
        
        let task = session.dataTask(with: request) { data, response, error in
            if let error = error {
                self.alert(message: error.localizedDescription, completion: completion)
                return
            }
            
            guard let response = response,
                  let httpResponse = response as? HTTPURLResponse else {
                self.alert(message: "Unexpected response type received", completion: completion)
                return
            }
            
            guard httpResponse.statusCode == 204 else {
                self.alert(message: "Unexpected response: \(httpResponse.statusCode)", completion: completion)
                return
            }
            
            self.alert(message: "Link saved.", completion: completion)
        }
        task.resume()
    }
    
    private func alert(message: String, completion: (() -> Void)?) {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: message, message: nil, preferredStyle: .alert)
            let okAction = UIAlertAction(title: "OK", style: .default) { _ in
                completion?();
            }
            alert.addAction(okAction)
            self.present(alert, animated: true)
        }
    }
    
    private func done() {
        self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }
    
    override func didSelectPost() {
        getURLAttachment() { result in
            switch result {
            case .success(let sharedURL):
                let bodyDict = [
                    "url": sharedURL.absoluteString,
                    "title": self.contentText,
                    ]
                self.postWebhook(bodyDict: bodyDict, completion: self.done)
            case .failure(let error):
                self.alert(message: "An error occurred: \(error.localizedDescription)", completion: self.done)
            }
        }
    }

    override func configurationItems() -> [Any]! {
        // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
        return []
    }

}

