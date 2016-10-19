angular.module('myApp').run(['$templateCache', function($templateCache) {$templateCache.put('public/devices-ctrl.html','<section class="well well-sm"><h1><i class="fa fa-plug" aria-hidden=true></i> \u5BB6\u96FB \u958B/\u95DC</h1><div ng-hide=devices.length><h1 class="alert alert-danger">No device found. Please pair devices.</h1></div><div ng-show=devices.length><div ng-repeat="device in devices"><h2 ng-if=device.error>{{device.error}}</h2><button type=button ng-click=onOff(device) ng-class="device.status? \'btn btn-block btn-danger\' : \'btn btn-block btn-success\'"><h4 class=text-left><i class="fa fa-power-off fa" aria-hidden=true></i> &nbsp; {{device.name}}</h4></button></div><a class="btn btn-lg btn-danger" ng-click="ctrlAll(devices, 1)"><i class="fa fa-toggle-on" aria-hidden=true></i> \u5168\u958B</a>&nbsp <a class="btn btn-lg btn-success" ng-click="ctrlAll(devices, 0)"><i class="fa fa-toggle-off" aria-hidden=true></i> \u5168\u95D7</a><hr><table class="table table-striped table-bordered table-condensed table-responsive"><tr class=info><th>Device Name</th><th>Addr</th></tr><tr class=warning ng-repeat="device in devices track by $index"><td><input type=text ng-model=device.name>&nbsp<button class="btn btn-lg btn-warning" ng-click="updateDeviceName(device, $index)"><i class="fa fa-refresh" aria-hidden=true></i> \u66F4\u540D</button></td><td>{{device.addr}}</td></tr></table></div></section>');
$templateCache.put('public/camera/cameraview.html','<section><h1>Camera view</h1><figure><iframe width=640 height=480 src=http://ubuy.asuscomm.com:8080/video.cgi frameborder=0><p>Your browser does not support iframes. It, however, works on Chrome</p></iframe><br></figure><button class="btn btn-primary" ng-click=vm.snapShot()><i class="fa fa-cloud-upload" aria-hidden=true></i> \u5B58\u5230 goolge drive</button> <a ng-href=/users/saveVideo>\u5B58\u5230 video</a></section>');
$templateCache.put('public/cron/cron.html','<section><h1>{{vm.selectedDevice.name}} \u958B\u95DC\u5B9A\u6642\u8A2D\u5B9A - \u7B2C{{vm.tmpJob.id+1}}\u7D44</h1><div class="well well-sm pdsa-block-danger"><h3><i class="fa fa-toggle-on" aria-hidden=true></i> \u958B\uFF1A</h3><cron-selection output=vm.tmpJob.on config=vm.myConfig></cron-selection>{{vm.tmpJob.on}}</div><div class="well well-sm pdsa-block-success"><h3><i class="fa fa-toggle-off" aria-hidden=true></i> \u95A2\uFF1A</h3><cron-selection output=vm.tmpJob.off config=vm.myConfig></cron-selection>{{vm.tmpJob.off}}</div></section><button class="btn btn-primary" ng-click=vm.addJob(vm.tmpJob)><i class="fa fa-plus" aria-hidden=true></i> Add</button> <button class="btn btn-danger" ng-click=vm.removeAllJobs()><i class="fa fa-trash-o fa-lg"></i> \u5168\u90E8\u522A\u9664</button><section><table class="table table-striped table-condensed table-bordered table-hover table-responsive"><thead><tr><th>\u7D44\u5225</th><th>\u661F\u671F</th><th>\u6642</th><th>\u5206</th><th>\u958B/\u95A2</th></tr></thead><tbody><tr ng-repeat="job in vm.cronJobs"><td>{{$index+1}}</td><td>{{job.dow}}</td><td>{{job.h}}</td><td>{{job.m}}</td><td>{{$index%2? \'Off\': \'On\'}}</td><td><button class="btn btn-warning" ng-click=vm.removeJob($index+1)><i class="fa fa-trash-o fa-lg"></i> \u522A\u9664</button></td></tr></tbody></table></section>');
$templateCache.put('public/cron/settings.html','<section class="well well-sm"><h1><i class="fa fa-calendar" aria-hidden=true></i>&nbsp;\u5BB6\u96FB\u5B9A\u6642\u8A2D\u5B9A</h1><div ng-hide=devices.length><h1 class="alert alert-danger">No device found. Please pair devices.</h1></div><div ng-repeat="device in devices"><a ng-href=/settings/{{$index}} type=button class="btn btn-info btn-block"><h4 class=text-left><i class="fa fa-clock-o" aria-hidden=true></i> &nbsp; {{device.name}} \u5B9A\u6642\u8A2D\u5B9A</h4></a></div></section>');
$templateCache.put('public/sensors/sensors.html','<section class="well well-sm"><h1><i class="fa fa-tachometer" aria-hidden=true></i> \u611F\u61C9\u6578\u64DA</h1><div class=row><div class=col-md-12><div ng-hide=sensors.length><h1 class="alert alert-danger">No device found. Please pair devices.</h1></div><div ng-show=sensors.length><table class="table table-striped table-bordered table-condensed table-responsive"><tr class=info><th>Sensor Name</th><th>Addr</th><th>value</th><th>\u96FB\u6C60\u96FB\u529B</th><th>\u5553\u52D5</th></tr><tr class=warning ng-repeat="sensor in sensors track by $index"><td><input type=text ng-model=sensor.name>&nbsp<button class="btn btn-warning" ng-click="updateSensorName(sensor, $index)"><i class="fa fa-refresh" aria-hidden=true></i> \u66F4\u540D</button></td><td>{{sensor.addr}}</td><td>{{sensor.status}}</td><td>{{sensor.battery}}</td><td><input type=checkbox ng-model=sensors[$index].enable></td></tr><label>\u5553\u52D5\u5075\u6E2C: <button class="btn btn-lg btn-danger" ng-click=setSensorsStatus(true)><i class="fa fa-bell-o" aria-hidden=true></i> \u5168\u958B</button>&nbsp <button class="btn btn-lg btn-success" ng-click=setSensorsStatus(false)><i class="fa fa-ban" aria-hidden=true></i> \u5168\u95D7</button></label></table></div></div></div></section>');
$templateCache.put('public/pair/pair.html','<section class="well well-sm"><h1><i class="fa fa-plus-circle" aria-hidden=true></i> \u52A0\u5165\u65B0\u667A\u80FD\u5BB6\u96FB</h1><h1 class="alert alert-danger">\u8ACB\u5148\u63D2\u5165\u667A\u80FD\u5BB6\u96FB\u6216\u6253\u958B sensor \u958B\u95DC\uFF0C\u4E26\u8F38\u5165\u540D\u7A31\u518D\u6309\u78BA\u5B9A.</h1><form name=myForm class=form autocomplete=on><label>\u667A\u80FD\u5BB6\u96FB\u540D\u7A31<br><input type=text name=id ng-model=vm.formData.id required> <span ng-show="myForm.id.$touched && myForm.id.$invalid">\u8ACB\u8F38\u5165\u667A\u80FD\u5BB6\u96FB\u540D\u7A31</span></label><fieldset class=form-section><legend>\u985E\u5225:</legend><p>\u958B\u95DC or \u5075\u6E2C\u5668? \u8ACB\u9078\u64C7\u5143\u4EF6\u985E\u578B:</p><label><input type=radio name=pair ng-model=vm.formData.type value=p required> 1-port \u958B\u95DC</label><br><label><input type=radio name=pair ng-model=vm.formData.type value=p4 required> 4-port \u958B\u95DC</label><br><label><input type=radio name=pair ng-model=vm.formData.type value=s required> \u5075\u6E2C\u5668</label><br></fieldset><button ng-disabled=myForm.pair.$error.required class="btn btn-lg btn-warning" ng-click=vm.ndCmd()><i ng-class=vm.icon></i> \u78BA\u5B9A</button><br></form></section>');}]);