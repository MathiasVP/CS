/**
	This file defines the representation of a Player
	A player is responsible for its own movement by
	providing keyboard listeners
**/

define(["lib/keyboard", "util/Mouse", "CollisionDetection", "Weapon", "config", "lib/gl-matrix"], function(KeyboardJS, MouseJS, CollisionDetection, Weapon, config, glMatrix) {
	return function(gl, x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.yAngle = 0;
		this.xAngle = 0;
		this.speed = 5;
		//X and Y direction. Not necessarily normalized
		var dir = [0, 0, 0];
		var weapon = null;
		
		this.position = function() {
			return [this.x, this.y, this.z];
		}
		
		this.move = function() {
			var onGround = CollisionDetection.isOnGround(this.position());
			var normalDir = [0, 0, 0];
			glMatrix.vec3.normalize(normalDir, dir);
			
			//Move forward
			var newX = this.x + this.speed*normalDir[0]*Math.cos(this.yAngle);
			var newY = this.y - this.speed*normalDir[0]*Math.sin(this.yAngle);
			var newZ = this.z + 18*dir[2];
			
			//Strafe
			newY -= this.speed*normalDir[1]*Math.cos(Math.PI - this.yAngle);
			newX += this.speed*normalDir[1]*Math.sin(Math.PI - this.yAngle);
			
			//Apply gravity if we're not on the ground. TODO: Accelerate instead of subtracting a constant
			if(!onGround) {
				newZ -= config.GRAVITY;
				dir[2] = Math.max(0, dir[2] - 0.1);
			}
			
			newPosition = CollisionDetection.move([this.x, this.y, this.z + config.MAX_Z_CHANGE], [newX, newY, newZ]);

			this.x = newPosition[0];
			this.y = newPosition[1];
			this.z = newPosition[2];
		}
		
		this.rotate = function(xDelta, yDelta) {
			var PI_HALF = Math.PI/2.0;
			var PI_TWO = Math.PI*2.0;
			
			this.yAngle += xDelta * config.MOUSE_SENSITIVITY;
			//Make sure we're in the interval [0, 2*pi]
			while (this.yAngle < 0) {
				this.yAngle += PI_TWO;
			}
			while (this.yAngle >= PI_TWO) {
				this.yAngle -= PI_TWO;
			}
									
			this.xAngle += yDelta * config.MOUSE_SENSITIVITY;
			//Make sure we're in the interval [-pi/2, pi/2]
			if(this.xAngle < -PI_HALF) {
				this.xAngle = -PI_HALF;
			}
			if(this.xAngle > PI_HALF) {
				this.xAngle = PI_HALF;
			}
		};
		
		this.render = function() {
			return weapon.render();
		}
		
		this.switchWeapon = function(weaponName) {
			weapon = new Weapon(weaponName);
		}
		
		MouseJS.on("left", function() {
			weapon.shoot();
		}, function() {
			weapon.idle();
		});
		
		MouseJS.on("right", function() {
			weapon.special();
		}, function() {
			weapon.idle();
		});
		
		KeyboardJS.on("r", function(event, keys, combo) {
			weapon.reload();
		}, function(event, keys, combo) {});
		
		//Handle w and s keys
		KeyboardJS.on("w,s", function(event, keys, combo){
			//Is w down?
			if(combo === "w") {
				dir[0] = 1;
			}
			//Is s down?
			if(combo === "s") {
				dir[0] = -1;
			}
			
			//Are both keys down?
			if(keys.indexOf("w") != -1 && keys.indexOf("s") != -1) {
				dir[0] = 0;
			}
		}, function(event, keys, combo) {	
			//Did we release the w key?
			if(combo === "w") {
				//Yep! Is s still being pressed?
				if(keys.indexOf("s") == -1) {
					//Nope. Stop movement
					dir[0] = 0;
				}
				else {
					dir[0] = -1;
				}
			}
			
			//Symmetric to the case above
			if(combo === "s") {
				if(keys.indexOf("w") == -1) {
					dir[0] = 0;
				}
				else {
					dir[0] = 1;
				}
			}
		});
		
		//Handle a and d keys
		//Symmetric to the handling of w and s
		KeyboardJS.on("a,d", function(event, keys, combo){
			if(combo === "a") {
				dir[1] = 1;
			}
			if(combo === "d") {
				dir[1] = -1;
			}

			if(keys.indexOf("a") != -1 && keys.indexOf("d") != -1) {
				dir[1] = 0;
			}
		}, function(event, keys, combo) {		
			if(combo === "a") {
				if(keys.indexOf("d") == -1) {
					dir[1] = 0;
				}
				else {
					dir[1] = -1;
				}
			}
			
			if(combo === "d") {
				if(keys.indexOf("a") == -1) {
					dir[1] = 0;
				}
				else {
					dir[1] = 1;
				}
			}
		});
		
		KeyboardJS.on("space", function(event, keys, combo) {
			var d = dir[2];
			if(d < 0.0001 && d > -0.0001) {
				dir[2] = 1;
			}
		}, function(event, keys, combo) {});
	};
});