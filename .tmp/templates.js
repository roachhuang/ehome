angular.module('myApp').run(['$templateCache', function($templateCache) {$templateCache.put('public/devices-ctrl.html','<section class="well well-sm"><h1><i class="fa fa-plug" aria-hidden=true></i> \u5BB6\u96FB \u958B/\u95DC</h1><div ng-repeat="device in devices"><button type=button ng-click=onOff(device) ng-class="device.status? \'btn btn-block btn-danger\' : \'btn btn-block btn-success\'"><h4 class=text-left><i class="fa fa-power-off fa" aria-hidden=true></i> &nbsp; {{device.name}}</h4></button></div><a class="btn btn-lg btn-danger" ng-click="ctrlAll(devices, 1)">\u5168\u958B</a>&nbsp <a class="btn btn-lg btn-success" ng-click="ctrlAll(devices, 0)">\u5168\u95D7</a></section>');
$templateCache.put('public/index.html','<!DOCTYPE html><html lang=zh-Hant ng-app=myApp><head><title>Smart Home</title><meta charset=UTF-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width, initial-scale=1"><title>Smart Home</title><link rel=stylesheet href=lib/bootstrap/dist/css/bootstrap.min.css><link rel=stylesheet href=lib/font-awesome/css/font-awesome.min.css><link rel=stylesheet href=views/css/angular-cron-jobs.min.css><link rel=stylesheet href=views/css/mycss.css><link rel=stylesheet href=views/css/nav.css><link rel=stylesheet href=views/css/widgets.css><script src=lib/jquery/dist/jquery.js></script><script src=lib/angular/angular.js></script><script src=lib/angular-cron-jobs/dist/angular-cron-jobs.min.js></script><script src=lib/angular-route/angular-route.js></script><script src=/js/app.js></script><script src=/js/devices-ctrl.js></script><script src=/js/nasa.ctrl.js></script><script src=/js/widgets.ctrl.js></script><script src=/js/camera/camera.ctrl.js></script><script src=/js/componments/devices-data-svc.js></script><script src=/js/componments/gpio-svc.js></script><script src=/js/config/router.js></script><script src=/js/cron/cron-ctrl.js></script><script src=/js/cron/cron-svc.js></script><script src=/js/cron/settings-ctrl.js></script><script src=/js/sensors/sensors-ctrl.js></script></head><body ng-controller=mainCtrl><div ng-include="\'/views/layout/nav.html\'"></div><section class=container-fluid><div class=row><div class="col-md-3 hidden-sm hidden-xs well well-sm"><div ng-include="\'/views/layout/sidebar.html\'"></div></div><main class=col-md-9><ng-view></ng-view></main></div></section><div class=container-fluid><div ng-include="\'/views/layout/footer.html\'"></div></div></body></html>');
$templateCache.put('public/camera/cameraview.html','<section><h1>Camera view</h1><figure><iframe width=640 height=480 src=http://ubuy.asuscomm.com:8080/video.cgi frameborder=0><p>Your browser does not support iframes. It, however, works on Chrome</p></iframe><br></figure><button class="btn btn-primary" ng-click=vm.snapShot()><i class="fa fa-cloud-upload" aria-hidden=true></i> \u5B58\u5230 goolge drive</button> <a ng-href=/users/saveVideo>\u5B58\u5230 video</a></section>');
$templateCache.put('public/cron/cron.html','<section><h1>{{vm.selectedDevice.name}} \u958B\u95DC\u5B9A\u6642\u8A2D\u5B9A - \u7B2C{{vm.tmpJob.id+1}}\u7D44</h1><div class="well well-sm pdsa-block-danger"><h3><i class="fa fa-toggle-on" aria-hidden=true></i> \u958B\uFF1A</h3><cron-selection output=vm.tmpJob.on config=vm.myConfig></cron-selection>{{vm.tmpJob.on}}</div><div class="well well-sm pdsa-block-success"><h3><i class="fa fa-toggle-off" aria-hidden=true></i> \u95A2\uFF1A</h3><cron-selection output=vm.tmpJob.off config=vm.myConfig></cron-selection>{{vm.tmpJob.off}}</div></section><button class="btn btn-primary" ng-click=vm.addJob(vm.tmpJob)>Add</button> <button class="btn btn-danger" ng-click=vm.removeAllJobs()>\u5168\u90E8\u522A\u9664</button><section><table class="table table-striped table-condensed table-bordered table-hover table-responsive"><thead><tr><th>\u7D44\u5225</th><th>Weekday</th><th>Hour</th><th>Minute</th><th>On/Off</th></tr></thead><tbody><tr ng-repeat="job in vm.cronJobs"><td>{{$index+1}}</td><td>{{job.dow}}</td><td>{{job.h}}</td><td>{{job.m}}</td><td>{{$index%2? \'Off\': \'On\'}}</td><td><button class="btn btn-warning" ng-click=vm.removeJob($index+1)>Delete</button></td></tr></tbody></table></section>');
$templateCache.put('public/cron/settings.html','<section class="well well-sm"><h1><i class="fa fa-calendar" aria-hidden=true></i>&nbsp;\u5BB6\u96FB\u5B9A\u6642\u8A2D\u5B9A</h1><div ng-repeat="device in devices"><a ng-href=/settings/{{$index}} type=button class="btn btn-info btn-block"><h4 class=text-left><i class="fa fa-clock-o" aria-hidden=true></i> &nbsp; {{device.name}} \u5B9A\u6642\u8A2D\u5B9A</h4></a></div></section>');
$templateCache.put('public/sensors/sensors.html','<section class="well well-sm"><h1><i class="fa fa-tachometer" aria-hidden=true></i> \u611F\u61C9\u6578\u64DA</h1><div class=row><div class=col-md-12><table class="table table-striped table-bordered table-condensed table-responsive"><tr class=info><th>Sensor Name</th><th>value</th><th>\u96FB\u6C60\u96FB\u529B</th><th>\u5553\u52D5</th></tr><tr class=warning ng-repeat="sensor in vm.sensors"><td>{{sensor.name}}</td><td>{{sensor.status}}</td><td>{{sensor.battery}}</td><td><input type=checkbox ng-model=sensor.enable></td></tr></table></div><label>\u5553\u52D5\u5075\u6E2C: <button class="btn btn-lg btn-danger" ng-click=vm.enableAllSensors()>\u5168\u958B</button>&nbsp <button class="btn btn-lg btn-success" ng-click=vm.disableAllSensors()>\u5168\u95D7</button></label></div></section>');}]);