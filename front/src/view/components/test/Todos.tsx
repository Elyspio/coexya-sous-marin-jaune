import { Box, Container, Grid, Paper } from "@mui/material";
import "./Test.scss";
import * as React from "react";
import { Todo } from "./todo/Todo";

export const Todos = () => {
	return (
		<Container className={"Test"}>
			<Paper>
				<Box p={2}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Todo mode={"public"} />
						</Grid>
						<Grid item xs={6}>
							<Todo mode={"user"} />
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
};

