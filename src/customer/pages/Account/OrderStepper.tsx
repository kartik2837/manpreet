import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
    { name: "Order Placed", description: "Your order has been placed", value: "PLACED" },
    { name: "Confirmed", description: "Seller has confirmed your order", value: "CONFIRMED" },
    { name: "Packed", description: "Item Packed in Dispatch Warehouse", value: "PACKED" },
    { name: "Shipped", description: "Item has been shipped", value: "SHIPPED" },
    { name: "In Transit", description: "Item is on its way", value: "IN_TRANSIT" },
    { name: "Out For Delivery", description: "Item is out for delivery", value: "OUT_FOR_DELIVERY" },
    { name: "Delivered", description: "Item has been delivered", value: "DELIVERED" },
];

const canceledStep = [
    { name: "Order Placed", description: "Your order was placed", value: "PLACED" },
    { name: "Order Canceled", description: "Your order was canceled", value: "CANCELLED" },
];

const OrderStepper = ({ orderStatus }: any) => {
    const [statusStep, setStatusStep] = useState(steps);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (orderStatus === 'CANCELLED') {
            setStatusStep(canceledStep);
            setActiveStep(1);
        } else {
            setStatusStep(steps);
            const index = steps.findIndex(s => s.value === orderStatus);
            setActiveStep(index !== -1 ? index : 0);
        }
    }, [orderStatus]);

    return (
        <Box className="mx-auto my-10">
            {statusStep.map((step, index) => (
                <div key={index} className="flex px-4">
                    <div className="flex flex-col items-center">
                        <Box
                            sx={{ zIndex: 1 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= activeStep
                                    ? "bg-gray-200 text-orange-400"
                                    : "bg-gray-300 text-gray-600"
                                }`}
                        >
                            {step.value === orderStatus ? (
                                <CheckCircleIcon />
                            ) : (
                                <FiberManualRecordIcon fontSize="small" />
                            )}
                        </Box>
                        {index < statusStep.length - 1 && (
                            <div
                                className={`h-20 w-[2px] ${index < activeStep ? "bg-orange-400" : "bg-gray-300"
                                    }`}
                            ></div>
                        )}
                    </div>

                    <div className="ml-4 w-full">
                        <div
                            className={`${step.value === orderStatus
                                    ? "bg-primary-color p-3 text-white font-medium rounded-md -translate-y-2 shadow-lg"
                                    : "py-2"
                                } ${orderStatus === "CANCELLED" && step.value === "CANCELLED"
                                    ? "bg-red-500"
                                    : ""
                                } transition-all duration-300`}
                        >
                            <p className="text-sm font-semibold">{step.name}</p>
                            <p
                                className={`${step.value === orderStatus ? "text-gray-100" : "text-gray-500"
                                    } text-xs mt-1`}
                            >
                                {step.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </Box>
    );
};

export default OrderStepper;
