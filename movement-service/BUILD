load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

nodejs_binary(
    name = "movement_service",
    data = [
        "@npm//express"
    ],
    entry_point = "app.js"
)
