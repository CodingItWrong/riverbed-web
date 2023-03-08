//
//  AttachmentHandler.swift
//  HydrantShare
//
//  Created by Josh Justice on 11/23/17.
//  Copyright © 2017 NeedBee. All rights reserved.
//

import Foundation
import MobileCoreServices

struct AttachmentHandler {
    func getURL(attachments: [Attachment], completion: @escaping (Result<URL>) -> Void)
    {
        // log all attachment types
        for attachment in attachments {
            NSLog("Attachment of type \(attachment.registeredTypeIdentifiers.joined(separator: ", "))")
        }
        
        // first, look for URL
        let urlType = kUTTypeURL as String
        for attachment in attachments {
            if attachment.hasItemConformingToTypeIdentifier(urlType) {
                attachment.loadItem(forTypeIdentifier: urlType) { (data, error) in
                    switch data {
                    case let url as URL:
                        // todo: figure out how to pass IUO error
                        NSLog("Found attached URL \(url.absoluteString)")
                        completion(.success(url))
                    default:
                        NSLog("Attachment said it was a URL, but did not return one")
                        completion(.failure(ShareError.urlNotFound))
                    }
                }
                return
            }
        }
        
        // if no URL found, look for text
        let plainTextType = kUTTypePlainText as String
        for attachment in attachments {
            if attachment.hasItemConformingToTypeIdentifier(plainTextType) {
                attachment.loadItem(forTypeIdentifier: plainTextType) { (data, error) in
                    switch data {
                    case let urlString as String:
                        NSLog("Found attached string \(urlString)")
                        if let url = URL(string: urlString) {
                            completion(.success(url))
                            return
                        } else if let url = try? self.getURL(fromString: urlString) {
                            completion(.success(url))
                            return
                        } else {
                            NSLog("There was a text attachment, but it was not a valid URL")
                            // fall through
                        }
                    default:
                        NSLog("Attachment said it was plain text, but did not return a String")
                        // fall through
                    }
                    NSLog("No URL or plain text attachments found")
                    completion(.failure(ShareError.urlNotFound))
                }
                return
            }
        }
        
        // if no URL or text found, fail
        NSLog("No URL or plain text attachments found")
        completion(.failure(ShareError.urlNotFound))
    }
    
    // see https://learnappmaking.com/regular-expressions-swift-string/
    func getURL(fromString string:String) throws -> URL? {
        let urlRegexString = "((https|http)://)((\\w|-)+)(([.]|[/])((\\w|-)+))+"
        let regex = try NSRegularExpression(pattern: urlRegexString)
        let nsString = string as NSString
        let matches = regex.matches(in: string, options: [], range: NSRange(location: 0, length: nsString.length)).map { nsString.substring(with: $0.range) }
        if matches.count > 0 {
            return URL(string: matches[0])
        } else {
            return nil
        }
    }
}
