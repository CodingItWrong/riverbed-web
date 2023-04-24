//
//  Config.sample.swift
//  HydrantShare
//
//  Created by Josh Justice on 11/21/17.
//  Copyright © 2017 NeedBee. All rights reserved.
//

import Foundation

enum Config {
    // dev
    static let webhookURL = URL(string: "http://localhost:3000/shares")!
    static let apiKey = "KAhbB18D0QZBFXBCJKE4xJZYyaWkUTK25LWrqNMIXI2-FSqT5NgJpA-ermcllZG3s8mqioWkfZWNlUVwcOIGrw"

    // production
//    static let webhookURL = URL(string: "https://ciw-list.herokuapp.com/shares")!
//    static let apiKey = "fake_api_key"
}
