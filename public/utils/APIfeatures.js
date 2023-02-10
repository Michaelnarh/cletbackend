class APIFeature {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = { ...this.queryString };
		let excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach((el) => delete queryObj[el]);
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

		this.query.find(JSON.parse(queryStr));
		return this;
	}
	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString?.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createdAt");
		}
		return this;
	}
	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.limit.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}
		return this;
	}

	paginate(num) {
		//pagination
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || num;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeature;
