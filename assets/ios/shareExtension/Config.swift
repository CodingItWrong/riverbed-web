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
    // static let webhookURL = URL(string: "http://localhost:3000/custom/links")!
    // static let apiKey = "KAhbB18D0QZBFXBCJKE4xJZYyaWkUTK25LWrqNMIXI2-FSqT5NgJpA-ermcllZG3s8mqioWkfZWNlUVwcOIGrw"

    // production
   static let webhookURL = URL(string: "https://ciw-list.herokuapp.com/custom/links")!
   static let apiKey = "SJcjRjusm01gHUOu0dFQZXhuTVyNiCtKX8KDdIaUo8UMICES-oa8ZGeqY49JsGFr9OyaDggJ0HoBHFPCOi7Xug"
}
