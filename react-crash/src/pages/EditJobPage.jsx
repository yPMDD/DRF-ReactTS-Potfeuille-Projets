import { useState } from "react";
import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditJobPage = ({ updateJobSubmit }) => {
	const job = useLoaderData();
	const [title, setTitle] = useState(job.title);
	const [type, setType] = useState(job.type);
	const [location, setLocation] = useState(job.location);
	const [description, setDescription] = useState(job.description);
	const [salary, setSalary] = useState(job.salary);
	const [companyName, setCompanyName] = useState(job.company.name);
	const [companyDescription, setCompanyDescription] = useState(
		job.company.description
	);
	const [contactEmail, setContactEmail] = useState(job.company.contactEmail);
	const [contactPhone, setContactPhone] = useState(job.company.contactPhone);

	const navigate = useNavigate();
	const { id } = useParams();

	const submitForm = (e) => {
		e.preventDefault();

		const updatedJob = {
			id,
			title,
			type,
			location,
			description,
			salary,
			company: {
				name: companyName,
				description: companyDescription,
				contactEmail,
				contactPhone,
			},
		};

		updateJobSubmit(updatedJob);

		toast.success("Job Updated Successfully");

		return navigate(`/jobs/${id}`);
	};

	return (
		<section className="bg-indigo-50">
			<div className="container max-w-2xl py-24 m-auto">
				<div className="px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0">
					<form onSubmit={submitForm}>
						<h2 className="mb-6 text-3xl font-semibold text-center">
							Update Job
						</h2>

						<div className="mb-4">
							<label
								htmlFor="type"
								className="block mb-2 font-bold text-gray-700"
							>
								Job Type
							</label>
							<select
								id="type"
								name="type"
								className="w-full px-3 py-2 border rounded"
								required
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<option value="Full-Time">Full-Time</option>
								<option value="Part-Time">Part-Time</option>
								<option value="Remote">Remote</option>
								<option value="Internship">Internship</option>
							</select>
						</div>

						<div className="mb-4">
							<label className="block mb-2 font-bold text-gray-700">
								Job Listing Name
							</label>
							<input
								type="text"
								id="title"
								name="title"
								className="w-full px-3 py-2 mb-2 border rounded"
								placeholder="eg. Beautiful Apartment In Miami"
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="description"
								className="block mb-2 font-bold text-gray-700"
							>
								Description
							</label>
							<textarea
								id="description"
								name="description"
								className="w-full px-3 py-2 border rounded"
								rows="4"
								placeholder="Add any job duties, expectations, requirements, etc"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
						</div>

						<div className="mb-4">
							<label
								htmlFor="type"
								className="block mb-2 font-bold text-gray-700"
							>
								Salary
							</label>
							<select
								id="salary"
								name="salary"
								className="w-full px-3 py-2 border rounded"
								required
								value={salary}
								onChange={(e) => setSalary(e.target.value)}
							>
								<option value="Under $50K">Under $50K</option>
								<option value="$50K - 60K">$50K - $60K</option>
								<option value="$60K - 70K">$60K - $70K</option>
								<option value="$70K - 80K">$70K - $80K</option>
								<option value="$80K - 90K">$80K - $90K</option>
								<option value="$90K - 100K">$90K - $100K</option>
								<option value="$100K - 125K">$100K - $125K</option>
								<option value="$125K - 150K">$125K - $150K</option>
								<option value="$150K - 175K">$150K - $175K</option>
								<option value="$175K - 200K">$175K - $200K</option>
								<option value="Over $200K">Over $200K</option>
							</select>
						</div>

						<div className="mb-4">
							<label className="block mb-2 font-bold text-gray-700">
								Location
							</label>
							<input
								type="text"
								id="location"
								name="location"
								className="w-full px-3 py-2 mb-2 border rounded"
								placeholder="Company Location"
								required
								value={location}
								onChange={(e) => setLocation(e.target.value)}
							/>
						</div>

						<h3 className="mb-5 text-2xl">Company Info</h3>

						<div className="mb-4">
							<label
								htmlFor="company"
								className="block mb-2 font-bold text-gray-700"
							>
								Company Name
							</label>
							<input
								type="text"
								id="company"
								name="company"
								className="w-full px-3 py-2 border rounded"
								placeholder="Company Name"
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
							/>
						</div>

						<div className="mb-4">
							<label
								htmlFor="company_description"
								className="block mb-2 font-bold text-gray-700"
							>
								Company Description
							</label>
							<textarea
								id="company_description"
								name="company_description"
								className="w-full px-3 py-2 border rounded"
								rows="4"
								placeholder="What does your company do?"
								value={companyDescription}
								onChange={(e) => setCompanyDescription(e.target.value)}
							></textarea>
						</div>

						<div className="mb-4">
							<label
								htmlFor="contact_email"
								className="block mb-2 font-bold text-gray-700"
							>
								Contact Email
							</label>
							<input
								type="email"
								id="contact_email"
								name="contact_email"
								className="w-full px-3 py-2 border rounded"
								placeholder="Email address for applicants"
								required
								value={contactEmail}
								onChange={(e) => setContactEmail(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="contact_phone"
								className="block mb-2 font-bold text-gray-700"
							>
								Contact Phone
							</label>
							<input
								type="tel"
								id="contact_phone"
								name="contact_phone"
								className="w-full px-3 py-2 border rounded"
								placeholder="Optional phone for applicants"
								value={contactPhone}
								onChange={(e) => setContactPhone(e.target.value)}
							/>
						</div>

						<div>
							<button
								className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
								type="submit"
							>
								Update Job
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};
export default EditJobPage;
