//
//  Attachment.swift
//  HydrantShare
//
//  Created by Josh Justice on 11/23/17.
//  Copyright © 2017 NeedBee. All rights reserved.
//

import Foundation

typealias AttachmentCompletionHandler = (NSSecureCoding?, Error?) -> Void

protocol Attachment {
    var registeredTypeIdentifiers: [String] { get }
    
    func hasItemConformingToTypeIdentifier(_: String) -> Bool
    
    func loadItem(forTypeIdentifier: String, completionHandler: AttachmentCompletionHandler?)
}

extension NSItemProvider: Attachment {
    func loadItem(forTypeIdentifier typeIdentifier: String, completionHandler: AttachmentCompletionHandler?) {
        self.loadItem(forTypeIdentifier: typeIdentifier, options: nil) { (a, b) in
            completionHandler?(a, b)
        }
    }
}

