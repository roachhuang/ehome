function AnyAlarm() {
	vm.anyAlarm = false;
	vm.sensors = {
		foo: { status: true },
		bar: { status: true }
	};
	for (key in vm.sensors) {
		if (!vm.sensors.hasOwnProperty(key)) {
			continue;
		}
		var obj = vm.sensor(key);
		vm.anyAlarm = vm.anyAlarm || obj.status;
	}
	return vm.anyAlarm;
}

AnyAlarm();