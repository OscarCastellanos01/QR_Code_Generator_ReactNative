const { withAndroidManifest } = require("@expo/config-plugins")

module.exports = function androiManifestPlugin(config) {
  return withAndroidManifest(config, async config => {
    let androidManifest = config.modResults.manifest

    androidManifest["queries"].push({
        "intent": [{
            "action": [{
                "$": {
                    "android:name": "android.intent.action.SEND_MULTIPLE"
                }
            }],
            "data": [{
                "$": {
                    "android:mimeType": "*/*"
                }
            }]
        }]
    });

    return config;
  })
}