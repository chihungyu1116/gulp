var Sphere=function(){var a={create_sphere_canvas:function(){var a=this.$canvas=jQuery(this.canvas);a.css({position:"relative","min-width":this.radius+"px","min-height":this.radius+"px",perspective:800})},create_sphere_container:function(){var a=this.$sphere_container=jQuery('<div id="sphere_container"></div>');a.css({position:"absolute","transform-style":"preserve-3d",width:this.radius,height:this.radius}),this.$canvas.append(a)},create_sphere_pivot:function(){var a=this.$sphere_pivot=jQuery('<div id="sphere_pivot"></div>');a.css({position:"absolute",left:this.center,top:this.center,width:1,height:1}),this.$sphere_container.append(a)},create_sphere_stick:function(a,b,c){var d='<div class="sphere_stick"><div class="stick_face_top"></div><div class="stick_face_bottom"></div></div>',e=jQuery(d);e.css({position:"absolute",width:1,height:this.radius,top:this.neg_center,transform:"rotate("+a+"deg)","transform-style":"preserve-3d",background:this.stick_color}),e.find(".stick_face_top").css({position:"absolute",width:this.stick_face_radius,height:this.stick_face_radius,top:this.neg_stick_face_radius_center,left:this.stick_face_radius_center,transform:"rotateX(90deg)",background:c,"border-radius":"50%",opacity:this.transparency}),e.find(".stick_face_bottom").css({position:"absolute",width:this.stick_face_radius,height:this.stick_face_radius,bottom:this.neg_stick_face_radius_center,left:this.stick_face_radius_center,transform:"rotateX(-90deg)",background:c,"border-radius":"50%",opacity:this.transparency}),b.append(e)},create_sphere_sticks:function(a){var b,c=this.color,d=this.color.length,e=0,f;for(b=0;b<180;b+=12)f=c[e%d],e++,this.create_sphere_stick(b,a,f)},create_sphere_plates:function(){var a,b,c;for(c=0;c<180;c+=12)b=jQuery('<div class="sphere_plate"></div>'),b.css({position:"absolute",width:1,height:1,transform:"rotateX("+c+"deg)","transform-style":"preserve-3d"}),this.create_sphere_sticks(b),this.$sphere_pivot.append(b)},create:function(){this.create_sphere_canvas(),this.create_sphere_container(),this.create_sphere_pivot(),this.create_sphere_plates(),this.$canvas.html(""),this.$canvas.append(this.$sphere_container)},rotate:function(a){a==="left"?this.degreeY--:a==="up"?this.degreeX++:a==="right"?this.degreeY++:a==="down"&&this.degreeX--,$("#sphere_container").css({transform:"rotateX("+this.degreeX+"deg) rotateY("+this.degreeY+"deg)"})},reset:function(){this.degreeY=0,this.degreeX=0,$("#sphere_container").css({transform:"rotateX("+this.degreeX+"deg) rotateY("+this.degreeY+"deg)"})}};return{init:function(b){var c=Object.create(a),d=[.02,.04,.06,.08,.1],e;return c.degreeX=0,c.degreeY=0,c.canvas=b.canvas,c.radius=b.radius%2===0?b.radius+1:b.radius,c.center=(c.radius-1)/2,c.neg_center=~c.center+1,c.density=d[b.density-1],e=Math.floor(c.radius*c.density),c.stick_face_radius=e%2===0?e+1:e,c.stick_face_radius_center=(c.stick_face_radius-1)/2,c.neg_stick_face_radius_center=~c.stick_face_radius_center+1,c.color=b.color,c.stick_color=b.stick_color,c.transparency=b.transparency||1,c.create(),c}}}();