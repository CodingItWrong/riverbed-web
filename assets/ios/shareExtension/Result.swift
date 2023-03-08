//
//  Result.swift
//  HydrantShare
//
//  Created by Josh Justice on 11/21/17.
//  Copyright © 2017 NeedBee. All rights reserved.
//

import Foundation

enum Result<T> {
    case failure(Error)
    case success(T)
}
