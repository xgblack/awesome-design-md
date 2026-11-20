"""Original orthographic clay scene: analytic ellipsoid intersections, matte lighting and soft shadows.
Run with Python + NumPy + Pillow. No downloaded model or image is used.
"""
from pathlib import Path
import math
import numpy as np
from PIL import Image, ImageFilter
W,H=1500,550
objects=[]
def add(center,radii,color): objects.append((np.array(center,dtype=np.float32),np.array(radii,dtype=np.float32),np.array(color,dtype=np.float32)/255))
# Soft, imperfect heaps of clay form the hills. Every subject has a real 3D surface.
for x,z,s,col in [(-5,-1.8,1.15,(214,145,170)),(-3.55,-2.1,1.0,(103,160,139)),(4.65,-2.2,1.4,(123,178,151)),(6.05,-1.6,.95,(222,155,181))]:
 add((x,s*.85,z),(1.35*s,2.3*s,.95*s),col)
 # Single continuous ellipsoid keeps the pressed-clay mountain silhouette clean.
# A little arch in the valley, made from rounded clay pieces.
for i in range(20):
 t=math.pi*i/19
 add((1.05*math.cos(t),.18+1.0*math.sin(t),-.85),(.22,.22,.23),(232,202,155))
# Tree at the right.
add((3.05,.55,.12),(.12,.65,.12),(91,109,68));add((3.05,1.65,.12),(.45,.85,.4),(228,182,79))
add((3.0,1.85,.26),(.31,.61,.23),(239,199,111))
# Hand-built figures, with visible volume, asymmetric hair and tiny facial details.
for x,col,skin,hair in [(-.74,(232,184,86),(229,187,152),(68,55,42)),(.79,(179,160,211),(195,148,115),(76,53,41))]:
 for dx in [-.14,.14]: add((x+dx,.22,.85),(.11,.27,.12),(68,84,67))
 add((x,.69,.85),(.34,.43,.22),col)
 for sign in [-1,1]:
  for j in range(4):add((x+sign*(.31+.055*j),.78-.065*j,.85),(.12,.13,.12),col)
 add((x,1.27,.85),(.24,.3,.23),skin)
 add((x-.025,1.47,.82),(.26,.19,.24),hair)
 add((x+.1,1.49,.8),(.2,.16,.21),hair)
 for dx in [-.075,.075]: add((x+dx,1.29,1.068),(.015,.022,.012),(56,43,33))
 add((x,1.205,1.075),(.035,.01,.008),(139,88,64))
# Flower to the left: a physical stem, petals and warm yellow centre.
add((-2.25,.36,1.0),(.06,.4,.06),(107,131,80))
add((-2.36,.32,1.02),(.22,.085,.075),(126,155,99))
for i in range(5):
 t=i*math.tau/5
 add((-2.25+.2*math.cos(t),.93+.2*math.sin(t),1.0),(.18,.19,.12),(224,168,190))
add((-2.25,.93,1.13),(.135,.14,.11),(229,181,65))
# Pebbles and a small soft sun.
for x,z,s in [(-3,1.9,.15),(3.9,1.5,.2),(1.8,2.3,.1)]:add((x,s*.25,z),(s,.065,s*.7),(171,160,118))
add((-1.0,3.4,-3.5),(.32,.32,.25),(241,214,159))
# Camera.
origin=np.array([0,5.8,13.5],dtype=np.float32);target=np.array([0,1.45,0],dtype=np.float32)
forward=target-origin;forward/=np.linalg.norm(forward)
right=np.cross(forward,np.array([0,1,0],dtype=np.float32));right/=np.linalg.norm(right)
up=np.cross(right,forward)
x=np.linspace(-7.4,7.4,W,dtype=np.float32);y=np.linspace(2.5,-2.5,H,dtype=np.float32)
xx,yy=np.meshgrid(x,y)
origins=origin+xx[...,None]*right+yy[...,None]*up
D=np.broadcast_to(forward,origins.shape)
T=np.full((H,W),np.inf,dtype=np.float32);IDs=np.full((H,W),-1,dtype=np.int32)
# Ground plane.
t=-origins[...,1]/D[...,1];T[:]=t;IDs[:]=0
for i,(c,r,color) in enumerate(objects,1):
 o=(origins-c)/r;d=D/r
 a=np.sum(d*d,axis=-1);b=2*np.sum(o*d,axis=-1);cc=np.sum(o*o,axis=-1)-1
 disc=b*b-4*a*cc
 q=(-b-np.sqrt(np.maximum(disc,0)))/(2*a)
 mask=(disc>=0)&(q>0)&(q<T)
 T[mask]=q[mask];IDs[mask]=i
P=origins+D*T[...,None]
N=np.zeros_like(P);N[...,1]=1
colors=np.zeros_like(P);colors[:]=np.array([255,250,240])/255
for i,(c,r,color) in enumerate(objects,1):
 mask=IDs==i
 n=(P[mask]-c)/(r*r);n/=np.linalg.norm(n,axis=-1)[:,None]
 N[mask]=n;colors[mask]=color
# Large warm soft-box. Its sampled positions soften contact shadows naturally.
light=np.array([-4,8,6],dtype=np.float32)
L=light-P;L/=np.linalg.norm(L,axis=-1)[...,None]
lambert=np.maximum(np.sum(N*L,axis=-1),0)
visibility=np.zeros((H,W),dtype=np.float32)
for off in [(-.7,0,-.7),(.7,0,-.7),(-.7,0,.7),(.7,0,.7)]:
 lightpos=light+np.array(off,dtype=np.float32);sorig=P+N*.012
 to=lightpos-sorig;dist=np.linalg.norm(to,axis=-1);sd=to/dist[...,None]
 shadow=np.zeros((H,W),dtype=bool)
 for c,r,color in objects:
  o=(sorig-c)/r;d=sd/r;a=np.sum(d*d,axis=-1);b=2*np.sum(o*d,axis=-1);cc=np.sum(o*o,axis=-1)-1;disc=b*b-4*a*cc
  q=(-b-np.sqrt(np.maximum(disc,0)))/(2*a)
  shadow|=(disc>=0)&(q>0)&(q<dist)
 visibility+=(~shadow)/4
# Warm bounce and matte highlight. Subtle procedural pigment does not obscure form.
shade=.53+.44*lambert*visibility+.07*np.maximum(N[...,1],0)
view=-D;halfv=L+view;halfv/=np.linalg.norm(halfv,axis=-1)[...,None]
spec=np.maximum(np.sum(N*halfv,axis=-1),0)**24*.05*visibility
noise=(np.sin(P[...,0]*87+P[...,1]*119+P[...,2]*71)*np.sin(P[...,0]*161-P[...,2]*83))*.008
rgb=colors*(shade[...,None]+noise[...,None])+spec[...,None]
# Ground never looks gray, but still receives soft contact shadows.
ground=IDs==0
soft=np.asarray(Image.fromarray(np.uint8(visibility*255)).filter(ImageFilter.GaussianBlur(10)),dtype=np.float32)/255
rgb[ground]=colors[ground]*(.90+.10*soft[ground,None])
rgb=np.clip(rgb,0,1);image=Image.fromarray(np.uint8(rgb*255))
image.save(Path(__file__).with_name('clay-landscape.webp'),quality=92)
print('Rendered original clay-landscape.webp',image.size)
