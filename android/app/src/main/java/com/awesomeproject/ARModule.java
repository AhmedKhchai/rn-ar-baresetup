package com.awesomeproject;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.Intent;
import android.net.Uri;

public class ARModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    ARModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ARModule";
    }

    @ReactMethod
    public void openViewer(String fileUrl, String title) {
        Intent sceneViewerIntent = new Intent(Intent.ACTION_VIEW);
        String sceneViewerData = "https://arvr.google.com/scene-viewer/1.0?";
        sceneViewerData = sceneViewerData + "file=" + fileUrl;
        sceneViewerData = sceneViewerData + "&title=" + title;
        sceneViewerData = sceneViewerData + "&mode=ar_preferred";
        sceneViewerIntent.setData(Uri.parse(sceneViewerData));
        sceneViewerIntent.setPackage("com.google.android.googlequicksearchbox");
        sceneViewerIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(sceneViewerIntent);
    }
}
