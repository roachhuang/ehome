var vm={};
function AnyAlarm() {
	vm.anyAlarm = false;
	vm.sensors = [
		{ status: true, name:'you' },
		{ status: false, name:'me' }
	];
	var i = 0;
	Object.keys(vm.sensors).forEach(function(key){	
		vm.sensors[key].status = 'kk';
		i++;
		console.log(key);
		console.log(vm.sensors[key].status);			
	});
	
	for(var i=0; i < vm.sensors.length; i++) {
		console.log(vm.sensors[i]);
		console.log(vm.sensors[i].status);
	}
}

AnyAlarm();

 