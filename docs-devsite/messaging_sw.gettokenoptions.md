Project: /docs/reference/js/_project.yaml
Book: /docs/reference/_book.yaml
page_type: reference

{% comment %}
DO NOT EDIT THIS FILE!
This is generated by the JS SDK team, and any local changes will be
overwritten. Changes should be made in the source code at
https://github.com/firebase/firebase-js-sdk
{% endcomment %}

# GetTokenOptions interface
Options for [getToken()](./messaging_.md#gettoken)

<b>Signature:</b>

```typescript
export interface GetTokenOptions 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [serviceWorkerRegistration](./messaging_sw.gettokenoptions.md#gettokenoptionsserviceworkerregistration) | ServiceWorkerRegistration | The service worker registration for receiving push messaging. If the registration is not provided explicitly, you need to have a <code>firebase-messaging-sw.js</code> at your root location. See [Retrieve the current registration token](https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token) for more details. |
|  [vapidKey](./messaging_sw.gettokenoptions.md#gettokenoptionsvapidkey) | string | The public server key provided to push services. It is used to authenticate the push subscribers to receive push messages only from sending servers that hold the corresponding private key. If it is not provided, a default VAPID key is used. Note that some push services (Chrome Push Service) require a non-default VAPID key. Therefore, it is recommended to generate and import a VAPID key for your project with [Configure Web Credentials with FCM](https://firebase.google.com/docs/cloud-messaging/js/client#configure_web_credentials_with_fcm)<!-- -->. See [The Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol) for details on web push services. |

## GetTokenOptions.serviceWorkerRegistration

The service worker registration for receiving push messaging. If the registration is not provided explicitly, you need to have a `firebase-messaging-sw.js` at your root location. See [Retrieve the current registration token](https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token) for more details.

<b>Signature:</b>

```typescript
serviceWorkerRegistration?: ServiceWorkerRegistration;
```

## GetTokenOptions.vapidKey

The public server key provided to push services. It is used to authenticate the push subscribers to receive push messages only from sending servers that hold the corresponding private key. If it is not provided, a default VAPID key is used. Note that some push services (Chrome Push Service) require a non-default VAPID key. Therefore, it is recommended to generate and import a VAPID key for your project with [Configure Web Credentials with FCM](https://firebase.google.com/docs/cloud-messaging/js/client#configure_web_credentials_with_fcm)<!-- -->. See [The Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol) for details on web push services.

<b>Signature:</b>

```typescript
vapidKey?: string;
```
