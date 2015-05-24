function TerrainBlock(url,size,throughput) {
	this.url=url;
	this.size=size;
	this.halfSize=this.size/2;
	this.throughput=throughput; //0=impassable terrain
	this.image=new Image();
	this.image.src=this.url;
}